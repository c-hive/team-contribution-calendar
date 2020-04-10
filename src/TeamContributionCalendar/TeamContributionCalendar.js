/* eslint-disable no-console */

import { stringify } from "svgson";
import * as getStyledCalendarElement from "../utils/GetStyledCalendarElement/GetStyledCalendarElement";
import * as gitHubUtils from "../utils/GitHubUtils/GitHubUtils";
import * as gitLabUtils from "../utils/GitLabUtils/GitLabUtils";
import * as calendarUtils from "../utils/CalendarUtils/CalendarUtils";
import * as javaScriptUtils from "../utils/JavaScriptUtils/JavaScriptUtils";
import * as tooltip from "../utils/Tooltip/Tooltip";
import BasicCalendar from "../resources/BasicCalendar/BasicCalendar.json";
import * as defaultUsers from "../resources/DefaultUsers/DefaultUsers";
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

    this.actualSvg = BasicCalendar;
    this.totalContributions = 0;
    this.isLoading = true;
  }

  async renderBasicAppearance() {
    this.renderSvg();
    this.renderHeader();

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

    if (!this.users.gitHub.length && !this.users.gitLab.length) {
      this.updateHeader({
        isLoading: false
      });
    }

    const defaultUserEmptyCalendar = gitHubUtils.setEmptyCalendarValues(
      defaultUserData.parsedCalendar
    );

    this.updateSvg({
      updatedSvg: defaultUserEmptyCalendar
    });
  }

  updateHeader(data) {
    if (javaScriptUtils.isDefined(data.isLoading)) {
      this.isLoading = data.isLoading;
    }

    if (javaScriptUtils.isDefined(data.contributions)) {
      this.totalContributions = this.totalContributions + data.contributions;
    }

    this.renderHeader();
  }

  updateSvg(data) {
    if (javaScriptUtils.isDefined(data.updatedSvg)) {
      this.actualSvg = {
        ...this.actualSvg,
        ...data.updatedSvg
      };
    }

    this.renderSvg();
  }

  renderHeader() {
    if (!calendarUtils.elementExists(this.configs.container)) {
      throw new Error("The given container does not exist.");
    }

    const calendarContainer = getStyledCalendarElement.container(
      this.configs.container
    );

    const newHeader = getStyledCalendarElement.header(
      this.totalContributions,
      this.isLoading
    );

    if (calendarUtils.elementExists(`#${elementIds.HEADER}`)) {
      const previousHeader = document.getElementById(elementIds.HEADER);

      calendarContainer.replaceChild(newHeader, previousHeader);
    } else {
      calendarContainer.prepend(newHeader);
    }
  }

  renderSvg() {
    if (!calendarUtils.elementExists(this.configs.container)) {
      throw new Error("The given container does not exist.");
    }

    const calendarContainer = getStyledCalendarElement.container(
      this.configs.container
    );

    const newSvgContainer = getStyledCalendarElement.svgContainer();
    newSvgContainer.innerHTML = stringify(this.actualSvg);

    if (calendarUtils.elementExists(`#${elementIds.SVG_CONTAINER}`)) {
      const previousSvgContainer = document.getElementById(
        elementIds.SVG_CONTAINER
      );

      calendarContainer.replaceChild(newSvgContainer, previousSvgContainer);
    } else {
      calendarContainer.appendChild(newSvgContainer);
    }

    const calendarTooltip = getStyledCalendarElement.tooltip();
    calendarContainer.appendChild(calendarTooltip);
    tooltip.addEventsToRectElements();
  }

  aggregateUserCalendars() {
    this.users.gitHub.map(async user => {
      // DEPRECATED: This supports both the object (current) and plain string (deprecated) formats.
      const username = user.name || user;

      const data = await gitHubUtils.getJsonFormattedCalendarAsync(
        this.configs.proxyServerUrl,
        username
      );

      if (data.error) {
        console.error(data.errorMessage);
      } else {
        this.processGitHubCalendar(data.parsedCalendar, {
          start: user.from,
          end: user.to
        });
      }
    });

    this.users.gitLab.map(async user => {
      // DEPRECATED: This supports both the object (current) and plain string (deprecated) formats.
      const username = user.name || user;

      const data = await gitLabUtils.getJsonFormattedCalendarAsync(
        this.configs.proxyServerUrl,
        username
      );

      if (data.error) {
        console.error(data.errorMessage);
      } else {
        this.processGitLabCalendar(data.parsedCalendar, {
          start: user.from,
          end: user.to
        });
      }
    });
  }

  processGitHubCalendar(gitHubUserJsonCalendar, timeframe) {
    const updatedSvg = gitHubUtils.mergeCalendarsContributions(
      this.actualSvg,
      gitHubUserJsonCalendar,
      timeframe
    );

    const lastYearContributions = gitHubUtils.getLastYearContributions(
      gitHubUserJsonCalendar
    );

    this.updateSvg({
      updatedSvg
    });

    this.updateHeader({
      contributions: lastYearContributions,
      isLoading: false
    });
  }

  processGitLabCalendar(gitLabUserJsonCalendar, timeframe) {
    const updatedSvg = gitLabUtils.mergeCalendarsContributions(
      this.actualSvg,
      gitLabUserJsonCalendar,
      timeframe
    );

    const lastYearContributions = gitLabUtils.getLastYearContributions(
      gitLabUserJsonCalendar
    );

    this.updateSvg({
      updatedSvg
    });

    this.updateHeader({
      contributions: lastYearContributions,
      isLoading: false
    });
  }
}
