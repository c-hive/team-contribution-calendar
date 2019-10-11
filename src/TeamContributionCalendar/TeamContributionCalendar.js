/* eslint-disable no-console */

import { stringify } from "svgson";
import * as getStyledCalendarElement from "../utils/GetStyledCalendarElement/GetStyledCalendarElement";
import * as gitHubUtils from "../utils/GitHubUtils/GitHubUtils";
import * as gitLabUtils from "../utils/GitLabUtils/GitLabUtils";
import * as javaScriptUtils from "../utils/JavaScriptUtils/JavaScriptUtils";
import * as tooltip from "../utils/Tooltip/Tooltip";
import BasicCalendar from "../resources/BasicCalendar/BasicCalendar.json";
import * as defaultUsers from "../resources/DefaultUsers/DefaultUsers";

export default class TeamContributionCalendar {
  constructor(container, gitHubUsers, gitLabUsers, proxyServerUrl) {
    this.configs = {
      container,
      proxyServerUrl
    };

    this.users = {
      gitHub: [...gitHubUsers],
      gitLab: [...gitLabUsers]
    };

    this.actualCalendar = BasicCalendar;
    this.totalContributions = 0;
    this.isLoading = true;
  }

  async renderBasicAppearance() {
    this.renderActualCalendar();
    this.renderActualHeader();

    const defaultUserData = await gitHubUtils.getJsonFormattedCalendarSync(
      this.configs.proxyServerUrl,
      defaultUsers.gitHub
    );

    if (defaultUserData.error) {
      this.updateCalendar({
        isLoading: false
      });

      throw new Error(defaultUserData.errorMessage);
    } else {
      const defaultUserEmptyCalendar = gitHubUtils.setEmptyCalendarValues(
        defaultUserData.parsedCalendar
      );

      this.updateCalendar({
        contributions: 0,
        updatedActualCalendar: defaultUserEmptyCalendar
      });
    }
  }

  updateCalendar(data) {
    if (javaScriptUtils.isDefined(data.isLoading)) {
      this.isLoading = data.isLoading;
    }

    if (javaScriptUtils.isDefined(data.updatedActualCalendar)) {
      const { contributions, updatedActualCalendar } = data;

      this.actualCalendar = {
        ...updatedActualCalendar
      };

      this.totalContributions = this.totalContributions + contributions;
    }

    this.renderActualCalendar();
  }

  renderActualHeader() {
    const containerData = getStyledCalendarElement.container(
      this.configs.container
    );
    const calendarHeader = getStyledCalendarElement.header(
      this.totalContributions,
      this.isLoading
    );
    containerData.selectedElement.prepend(calendarHeader);
  }

  renderActualCalendar() {
    const containerData = getStyledCalendarElement.container(
      this.configs.container
    );
    const svgElement = getStyledCalendarElement.svgCalendar(
      this.configs.container
    );

    console.log(containerData.selectedElement.childNodes[0]);
    console.log(svgElement);

    if (containerData.error) {
      throw new Error(containerData.errorMessage);
    }

    const calendarTooltip = getStyledCalendarElement.tooltip();

    const stringifiedHTMLContent = stringify(this.actualCalendar);

    // containerData.selectedElement.innerHTML = stringifiedHTMLContent;
    SVGAElement.innerHTML = stringifiedHTMLContent;
    containerData.selectedElement.appendChild(calendarTooltip);

    tooltip.addEventsToRectElements();
  }

  aggregateUserCalendars() {
    this.users.gitHub.map(async gitHubUsername => {
      const gitHubUserData = await gitHubUtils.getJsonFormattedCalendarAsync(
        this.configs.proxyServerUrl,
        gitHubUsername
      );

      if (gitHubUserData.error) {
        console.error(gitHubUserData.errorMessage);
      } else {
        this.processGitHubCalendar(gitHubUserData.parsedCalendar);
      }
    });

    this.users.gitLab.map(async gitLabUsername => {
      const gitLabUserData = await gitLabUtils.getJsonFormattedCalendarAsync(
        this.configs.proxyServerUrl,
        gitLabUsername
      );

      if (gitLabUserData.error) {
        console.error(gitLabUserData.errorMessage);
      } else {
        this.processGitLabCalendar(gitLabUserData.parsedCalendar);
      }
    });
  }

  processGitHubCalendar(gitHubUserJsonCalendar) {
    const updatedActualCalendar = gitHubUtils.mergeCalendarsContributions(
      this.actualCalendar,
      gitHubUserJsonCalendar
    );

    const lastYearContributions = gitHubUtils.getLastYearContributions(
      gitHubUserJsonCalendar
    );

    this.updateCalendar({
      updatedActualCalendar,
      contributions: lastYearContributions,
      isLoading: false
    });
  }

  processGitLabCalendar(gitLabUserJsonCalendar) {
    const updatedActualCalendar = gitLabUtils.mergeCalendarsContributions(
      this.actualCalendar,
      gitLabUserJsonCalendar
    );

    const lastYearContributions = gitLabUtils.getLastYearContributions(
      gitLabUserJsonCalendar
    );

    this.updateCalendar({
      updatedActualCalendar,
      contributions: lastYearContributions,
      isLoading: false
    });
  }
}
