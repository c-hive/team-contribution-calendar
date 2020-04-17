/* eslint-disable no-console */

import { stringify } from "svgson";
import * as getStyledCalendarElement from "../utils/GetStyledCalendarElement/GetStyledCalendarElement";
import * as gitHubUtils from "../utils/GitHubUtils/GitHubUtils";
import * as gitLabUtils from "../utils/GitLabUtils/GitLabUtils";
import {
  elementExists,
  filterByTimeframe,
  aggregateCalendars,
  aggregateContributions
} from "../utils/CalendarUtils/CalendarUtils";
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

    const defaultUserEmptyCalendar = gitHubUtils.initialize(
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
    if (!elementExists(this.configs.container)) {
      throw new Error("The given container does not exist.");
    }

    const calendarContainer = getStyledCalendarElement.container(
      this.configs.container
    );

    const newHeader = getStyledCalendarElement.header(
      this.totalContributions,
      this.isLoading
    );

    if (elementExists(`#${elementIds.HEADER}`)) {
      const previousHeader = document.getElementById(elementIds.HEADER);

      calendarContainer.replaceChild(newHeader, previousHeader);
    } else {
      calendarContainer.prepend(newHeader);
    }
  }

  renderSvg() {
    if (!elementExists(this.configs.container)) {
      throw new Error("The given container does not exist.");
    }

    const calendarContainer = getStyledCalendarElement.container(
      this.configs.container
    );

    const newSvgContainer = getStyledCalendarElement.svgContainer();
    newSvgContainer.innerHTML = stringify(this.actualSvg);

    if (elementExists(`#${elementIds.SVG_CONTAINER}`)) {
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
        const timeframe = { start: user.from, end: user.to };
        const dailyDataWithContributions = gitHubUtils.dailyDataWithContributionsTransformation(
          data.parsedCalendar
        );
        const filteredDailyDataWithContributions = filterByTimeframe(
          dailyDataWithContributions,
          timeframe
        );

        this.processCalendar(filteredDailyDataWithContributions);
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
        const timeframe = { start: user.from, end: user.to };
        const filteredDailyDataWithContributions = filterByTimeframe(
          data.parsedCalendar,
          timeframe
        );

        this.processCalendar(filteredDailyDataWithContributions);
      }
    });
  }

  processCalendar(dailyDataWithContributions) {
    const aggregatedCalendars = aggregateCalendars(
      this.actualSvg,
      dailyDataWithContributions
    );
    const aggregatedContributions = aggregateContributions(
      dailyDataWithContributions
    );

    this.updateSvg({
      updatedSvg: aggregatedCalendars
    });

    this.updateHeader({
      contributions: aggregatedContributions,
      isLoading: false
    });
  }
}
