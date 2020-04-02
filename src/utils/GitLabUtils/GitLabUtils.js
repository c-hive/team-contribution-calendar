/* eslint-disable no-console */

import * as proxy from "../Proxy/Proxy";
import * as calendarUtils from "../CalendarUtils/CalendarUtils";
import * as javaScriptUtils from "../JavaScriptUtils/JavaScriptUtils";

const getDailyContributions = (gitLabCalendar, date) => {
  if (gitLabCalendar[date]) {
    return gitLabCalendar[date];
  }

  return 0;
};

export const mergeCalendarsContributions = (
  actualCalendar,
  gitLabUserJsonCalendar,
  startDate
) => {
  const copiedActualCalendar = javaScriptUtils.deepCopyObject(actualCalendar);

  copiedActualCalendar.children[0].children.forEach((weeklyData, weekIndex) => {
    weeklyData.children
      .filter(dailyData =>
        calendarUtils.filterContributionDays(dailyData, startDate)
      )
      .forEach((_, dayIndex) => {
        const actualCalendarDailyData = calendarUtils.getCalendarDataByIndexes(
          actualCalendar,
          weekIndex,
          dayIndex
        );
        const totalDailyContributions =
          Number(actualCalendarDailyData.attributes["data-count"]) +
          getDailyContributions(
            gitLabUserJsonCalendar,
            actualCalendarDailyData.attributes["data-date"]
          );

        copiedActualCalendar.children[0].children[weekIndex].children[
          dayIndex
        ].attributes = {
          ...actualCalendarDailyData.attributes,
          "data-count": String(totalDailyContributions),
          fill: calendarUtils.getFillColor(totalDailyContributions)
        };
      });
  });

  return copiedActualCalendar;
};

export const getLastYearContributions = userJsonCalendar => {
  let lastYearContributions = 0;

  Object.keys(userJsonCalendar).forEach(date => {
    lastYearContributions += userJsonCalendar[date];
  });

  return lastYearContributions;
};

export const getJsonFormattedCalendarAsync = async (
  proxyServerUrl,
  gitLabUsername
) => {
  const url = proxy.getGitLabProxyUrl(proxyServerUrl, gitLabUsername);
  const responseData = await fetch(url);

  if (javaScriptUtils.isSuccess(responseData.status)) {
    return responseData.json().then(parsedCalendar => ({
      parsedCalendar,
      error: false,
      errorMessage: null
    }));
  }

  return {
    error: true,
    errorMessage: `Could not fetch the calendar of ${gitLabUsername}.`
  };
};
