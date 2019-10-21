/* eslint-disable no-console */

import { stringify } from "svgson";
import * as getStyledCalendarElement from "../utils/GetStyledCalendarElement/GetStyledCalendarElement";
import * as gitHubUtils from "../utils/GitHubUtils/GitHubUtils";
import * as gitLabUtils from "../utils/GitLabUtils/GitLabUtils";
import * as javaScriptUtils from "../utils/JavaScriptUtils/JavaScriptUtils";
import * as tooltip from "../utils/Tooltip/Tooltip";
import BasicCalendar from "../resources/BasicCalendar/BasicCalendar.json";
import * as defaultUsers from "../resources/DefaultUsers/DefaultUsers";
import * as calendarUtils from "../utils/CalendarUtils/CalendarUtils";
import elementIds from "../resources/ElementIds/ElementIds";

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
      this.updateHeader({
        isLoading: false
      });

      throw new Error(defaultUserData.errorMessage);
    }

    const defaultUserEmptyCalendar = gitHubUtils.setEmptyCalendarValues(
      defaultUserData.parsedCalendar
    );

    this.updateCalendar({
      updatedActualCalendar: defaultUserEmptyCalendar
    });
  }

  updateHeader(data) {
    if (javaScriptUtils.isDefined(data.isLoading)) {
      this.isLoading = data.isLoading;
    }

    if (javaScriptUtils.isDefined(data.contributions)) {
      this.totalContributions = this.totalContributions + data.contributions;
    }

    this.renderActualHeader();
  }

  updateCalendar(data) {
    if (javaScriptUtils.isDefined(data.updatedActualCalendar)) {
      this.actualCalendar = {
        ...this.actualCalendar,
        ...data.updatedActualCalendar
      };
    }

    this.renderActualCalendar();
  }

  renderActualHeader() {
    const containerData = getStyledCalendarElement.container(
      this.configs.container
    );

    const newHeader = getStyledCalendarElement.header(
      this.totalContributions,
      this.isLoading
    );

    if (calendarUtils.elementExists(elementIds.HEADER)) {
      const previousHeader = document.getElementById(elementIds.HEADER);

      containerData.selectedElement.replaceChild(newHeader, previousHeader);
    } else {
      containerData.selectedElement.prepend(newHeader);
    }
  }

  renderActualCalendar() {
    const containerData = getStyledCalendarElement.container(
      this.configs.container
    );

    if (containerData.error) {
      throw new Error(containerData.errorMessage);
    }

    const newSvgContainer = getStyledCalendarElement.svgContainer();
    newSvgContainer.innerHTML = stringify(this.actualCalendar);

    if (calendarUtils.elementExists(elementIds.SVG_CONTAINER)) {
      const previousSvgContainer = document.getElementById(
        elementIds.SVG_CONTAINER
      );

      containerData.selectedElement.replaceChild(
        newSvgContainer,
        previousSvgContainer
      );
    } else {
      containerData.selectedElement.appendChild(newSvgContainer);
    }

    const calendarTooltip = getStyledCalendarElement.tooltip();
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
      updatedActualCalendar
    });

    this.updateHeader({
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
      updatedActualCalendar
    });

    this.updateHeader({
      contributions: lastYearContributions,
      isLoading: false
    });
  }
}
