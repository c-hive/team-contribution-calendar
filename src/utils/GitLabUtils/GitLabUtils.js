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

const objectify = arr =>
  arr.reduce((result, [date, contributions]) => {
    return {
      ...result,
      [date]: contributions
    };
  }, {});

export const aggregateCalendars = (actualCalendar, userCalendar) => {
  const copiedActualCalendar = javaScriptUtils.deepCopyObject(actualCalendar);
  const objectifiedUserCalendar = objectify(userCalendar);

  copiedActualCalendar.children[0].children.forEach((week, weekIndex) =>
    week.children.forEach((day, dayIndex) => {
      const actualCalendarDailyData = calendarUtils.getCalendarDataByIndexes(
        actualCalendar,
        weekIndex,
        dayIndex
      );

      const totalDailyContributions =
        Number(actualCalendarDailyData.attributes["data-count"]) +
        getDailyContributions(
          objectifiedUserCalendar,
          actualCalendarDailyData.attributes["data-date"]
        );

      copiedActualCalendar.children[0].children[weekIndex].children[
        dayIndex
      ].attributes = {
        ...actualCalendarDailyData.attributes,
        "data-count": String(totalDailyContributions),
        fill: calendarUtils.getFillColor(totalDailyContributions)
      };
    })
  );

  return copiedActualCalendar;
};

export const aggregateContributions = calendar =>
  // Using _ to indicate the parameter is unused is a common practice: https://stackoverflow.com/a/32198002/9599137
  // eslint-disable-next-line no-unused-vars
  calendar.reduce((total, [_, contributions]) => total + contributions, 0);

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
