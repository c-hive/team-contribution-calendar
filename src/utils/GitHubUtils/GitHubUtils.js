/* eslint-disable no-console */

import { parse, parseSync } from "svgson";
import * as proxy from "../Proxy/Proxy";
import * as calendarUtils from "../CalendarUtils/CalendarUtils";
import * as javaScriptUtils from "../JavaScriptUtils/JavaScriptUtils";

const getUserSvg = async (proxyServerUrl, gitHubUsername) => {
  const userUrl = proxy.getGitHubProxyUrl(proxyServerUrl, gitHubUsername);
  const responseData = await fetch(userUrl);

  if (javaScriptUtils.isSuccess(responseData.status)) {
    return responseData.text().then(body => {
      const div = document.createElement("div");
      div.innerHTML = body;
      const rawUserSvg = div.querySelector(".js-calendar-graph-svg");

      return {
        rawUserSvg,
        error: false
      };
    });
  }

  return {
    rawUserSvg: null,
    error: true
  };
};

export const setEmptyCalendarValues = calendar => {
  const copiedCalendar = javaScriptUtils.deepCopyObject(calendar);

  copiedCalendar.attributes = {
    viewBox: "0 0 828 128",
    preserveAspectRatio: "xMidYMin slice",
    class: "js-calendar-graph-svg",
    style:
      "width: 100%; padding-bottom: 14.5%; height: 1px; overflow: visible; font-size: .8em"
  };

  copiedCalendar.children[0].children.forEach((weeklyData, weekIndex) => {
    weeklyData.children.forEach((dailyData, dayIndex) => {
      copiedCalendar.children[0].children[weekIndex].children[
        dayIndex
      ].attributes = {
        ...dailyData.attributes,
        "data-count": "0",
        fill: "#ebedf0"
      };
    });
  });

  copiedCalendar.children[0].children.forEach(data => {
    if (data.name === "text") {
      // eslint-disable-next-line no-param-reassign
      data.attributes = { ...data.attributes, fill: "#767676" };
    }
  });

  return copiedCalendar;
};

export const mergeCalendarsContributions = (
  actualCalendar,
  gitHubUserJsonCalendar,
  startDate
) => {
  const copiedActualCalendar = javaScriptUtils.deepCopyObject(actualCalendar);

  gitHubUserJsonCalendar.children[0].children.forEach(
    (weeklyData, weekIndex) => {
      weeklyData.children
        .filter(dailyData =>
          calendarUtils.filterContributionDays(dailyData, startDate)
        )
        .forEach((dailyData, dayIndex) => {
          const actualCalendarDailyData = calendarUtils.getCalendarDataByIndexes(
            copiedActualCalendar,
            weekIndex,
            dayIndex
          );
          const totalDailyContributions =
            Number(actualCalendarDailyData.attributes["data-count"]) +
            Number(dailyData.attributes["data-count"]);

          copiedActualCalendar.children[0].children[weekIndex].children[
            dayIndex
          ].attributes = {
            ...actualCalendarDailyData.attributes,
            "data-count": String(totalDailyContributions),
            fill: calendarUtils.getFillColor(totalDailyContributions)
          };
        });
    }
  );

  return copiedActualCalendar;
};

export const getLastYearContributions = userCalendar => {
  let lastYearContributions = 0;

  userCalendar.children[0].children.forEach(weeklyData => {
    weeklyData.children.forEach(dailyData => {
      if (dailyData.attributes["data-count"]) {
        lastYearContributions += Number(dailyData.attributes["data-count"]);
      }
    });
  });

  return lastYearContributions;
};

export const getJsonFormattedCalendarSync = async (
  proxyServerUrl,
  gitHubUsername
) => {
  const userData = await getUserSvg(proxyServerUrl, gitHubUsername);

  if (userData.error) {
    return {
      ...userData,
      errorMessage: "Could not fetch the calendar of the default user."
    };
  }

  const parsedCalendar = parseSync(userData.rawUserSvg.outerHTML);

  return {
    parsedCalendar,
    error: false,
    errorMessage: null
  };
};

export const getJsonFormattedCalendarAsync = async (
  proxyServerUrl,
  gitHubUsername
) => {
  const userData = await getUserSvg(proxyServerUrl, gitHubUsername);

  if (userData.error) {
    return {
      ...userData,
      errorMessage: `Could not fetch the calendar of ${gitHubUsername}.`
    };
  }

  return parse(userData.rawUserSvg.outerHTML).then(parsedGitHubCalendar => ({
    parsedCalendar: parsedGitHubCalendar,
    error: false,
    errorMessage: null
  }));
};
