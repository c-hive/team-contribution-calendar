/* eslint-disable no-console */

import { parse, parseSync } from "svgson";
import produce from "immer";
import { extractWeeksFromGitHub } from "../CalendarUtils/CalendarUtils";
import * as proxy from "../Proxy/Proxy";
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

export const initialize = produce(draft => {
  draft.attributes = {
    viewBox: "0 0 828 128",
    preserveAspectRatio: "xMidYMin slice",
    class: "js-calendar-graph-svg",
    style:
      "width: 100%; padding-bottom: 14.5%; height: 1px; overflow: visible; font-size: .8em"
  };

  draft.children[0].children.forEach((week, weekIndex) => {
    if (week.name === "text") {
      draft.children[0].children[weekIndex].fill = "#767676";
    }

    week.children.forEach((day, dayIndex) => {
      draft.children[0].children[weekIndex].children[dayIndex].attributes[
        "data-count"
      ] = 0;
      draft.children[0].children[weekIndex].children[dayIndex].attributes.fill =
        "#ebedf0";
    });
  });
});

export const dailyDataWithContributionsTransformation = calendar => {
  const weeks = extractWeeksFromGitHub(calendar);
  const dailyDataWithContributions = {};

  weeks.forEach(week => {
    week.children.forEach(day => {
      const date = day.attributes["data-date"];
      const contributions = day.attributes["data-count"];

      dailyDataWithContributions[date] = Number(contributions);
    });
  });

  return dailyDataWithContributions;
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
