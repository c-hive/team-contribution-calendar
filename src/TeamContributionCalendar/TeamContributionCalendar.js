/* eslint-disable no-console */

import { stringify } from "svgson";
import * as GetStyledCalendarElement from "../utils/GetStyledCalendarElement/GetStyledCalendarElement";
import * as GitHubUtils from "../utils/GitHubUtils/GitHubUtils";
import * as GitLabUtils from "../utils/GitLabUtils/GitLabUtils";
import * as JavaScriptUtils from "../utils/JavaScriptUtils/JavaScriptUtils";
import * as Tooltip from "../utils/Tooltip/Tooltip";
import BasicCalendar from "../resources/BasicCalendar/BasicCalendar.json";
import * as DefaultUsers from "../resources/DefaultUsers/DefaultUsers";

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

    const defaultUserData = await GitHubUtils.getJsonFormattedCalendarSync(
      this.configs.proxyServerUrl,
      DefaultUsers.GitHub
    );

    if (defaultUserData.error) {
      this.updateCalendar({
        isLoading: false
      });

      throw new Error(defaultUserData.errorMessage);
    } else {
      const defaultUserEmptyCalendar = GitHubUtils.setEmptyCalendarValues(
        defaultUserData.parsedCalendar
      );

      this.updateCalendar({
        contributions: 0,
        updatedActualCalendar: defaultUserEmptyCalendar
      });
    }
  }

  updateCalendar(data) {
    if (JavaScriptUtils.isDefined(data.isLoading)) {
      this.isLoading = data.isLoading;
    }

    if (JavaScriptUtils.isDefined(data.updatedActualCalendar)) {
      const { contributions, updatedActualCalendar } = data;

      this.actualCalendar = {
        ...updatedActualCalendar
      };

      this.totalContributions = this.totalContributions + contributions;
    }

    this.renderActualCalendar();
  }

  renderActualCalendar() {
    const containerData = GetStyledCalendarElement.container(
      this.configs.container
    );

    if (containerData.error) {
      throw new Error(containerData.errorMessage);
    }

    const calendarHeader = GetStyledCalendarElement.header(
      this.totalContributions,
      this.isLoading
    );
    const calendarTooltip = GetStyledCalendarElement.tooltip();

    const stringifiedHTMLContent = stringify(this.actualCalendar);

    containerData.selectedElement.innerHTML = stringifiedHTMLContent;
    containerData.selectedElement.prepend(calendarHeader);
    containerData.selectedElement.appendChild(calendarTooltip);

    Tooltip.addEventsToRectElements();
  }

  aggregateUserCalendars() {
    this.users.gitHub.map(async gitHubUsername => {
      const gitHubUserData = await GitHubUtils.getJsonFormattedCalendarAsync(
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
      const gitLabUserData = await GitLabUtils.getJsonFormattedCalendarAsync(
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
    const updatedActualCalendar = GitHubUtils.mergeCalendarsContributions(
      this.actualCalendar,
      gitHubUserJsonCalendar
    );

    const lastYearContributions = GitHubUtils.getLastYearContributions(
      gitHubUserJsonCalendar
    );

    this.updateCalendar({
      updatedActualCalendar,
      contributions: lastYearContributions,
      isLoading: false
    });
  }

  processGitLabCalendar(gitLabUserJsonCalendar) {
    const updatedActualCalendar = GitLabUtils.mergeCalendarsContributions(
      this.actualCalendar,
      gitLabUserJsonCalendar
    );

    const lastYearContributions = GitLabUtils.getLastYearContributions(
      gitLabUserJsonCalendar
    );

    this.updateCalendar({
      updatedActualCalendar,
      contributions: lastYearContributions,
      isLoading: false
    });
  }
}
