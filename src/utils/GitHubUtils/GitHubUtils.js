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

export const sanitize = calendar =>
  calendar.children[0].children
    .filter(item => {
      const isDay =
        item.attributes.class !== "wday" && item.attributes.class !== "month";

      return isDay;
    })
    .map(week => week.children.map(day => day));

export const aggregateCalendars = (actualCalendar, userCalendar) => {
  const copiedActualCalendar = javaScriptUtils.deepCopyObject(actualCalendar);

  userCalendar.forEach((week, weekIndex) =>
    week.forEach((day, dayIndex) => {
      if (day) {
        const actualCalendarDailyData = calendarUtils.getCalendarDataByIndexes(
          copiedActualCalendar,
          weekIndex,
          dayIndex
        );

        const totalDailyContributions =
          +actualCalendarDailyData.attributes["data-count"] +
          +day.attributes["data-count"];

        copiedActualCalendar.children[0].children[weekIndex].children[
          dayIndex
        ].attributes = {
          ...actualCalendarDailyData.attributes,
          "data-count": String(totalDailyContributions),
          fill: calendarUtils.getFillColor(totalDailyContributions)
        };
      }
    })
  );

  return copiedActualCalendar;
};

export const aggregateContributions = calendar =>
  calendar.reduce((totalContributions, week) => {
    const weeklyContributions = week.reduce(
      (totalWeeklyContributions, day) =>
        day
          ? totalWeeklyContributions + +day.attributes["data-count"]
          : totalWeeklyContributions,
      0
    );

    return totalContributions + weeklyContributions;
  }, 0);

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
