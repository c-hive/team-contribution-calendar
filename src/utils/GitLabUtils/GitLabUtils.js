/* eslint-disable no-console */

import * as Proxy from '../Proxy/Proxy';
import * as CalendarUtils from '../CalendarUtils/CalendarUtils';
import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';

const getDailyContributions = (gitLabCalendar, date) => {
  if (gitLabCalendar[date]) {
    return gitLabCalendar[date];
  }

  return 0;
};

export const mergeCalendarsContributions = (actualCalendar, gitLabUserJsonCalendar) => {
  const copiedActualCalendar = JavaScriptUtils.deepCopyObject(actualCalendar);

  copiedActualCalendar.children[0].children.forEach((weeklyData, weekIndex) => {
    weeklyData.children.forEach((dailyData, dayIndex) => {
      if (dailyData.attributes['data-count']) {
        const actualCalendarDailyData = CalendarUtils
          .getCalendarDataByIndexes(actualCalendar, weekIndex, dayIndex);
        const totalDailyContributions = Number(actualCalendarDailyData.attributes['data-count']) + getDailyContributions(gitLabUserJsonCalendar, actualCalendarDailyData.attributes['data-date']);

        copiedActualCalendar.children[0].children[weekIndex].children[dayIndex].attributes = {
          ...actualCalendarDailyData.attributes,
          'data-count': String(totalDailyContributions),
          fill: CalendarUtils.getFillColor(totalDailyContributions),
        };
      }
    });
  });

  return copiedActualCalendar;
};

export const getLastYearContributions = (userJsonCalendar) => {
  let lastYearContributions = 0;

  Object.keys(userJsonCalendar).forEach((date) => {
    lastYearContributions += userJsonCalendar[date];
  });

  return lastYearContributions;
};


export const getJsonFormattedCalendarAsync = async (proxyServerUrl, gitLabUsername) => {
  const url = Proxy.getGitLabProxyUrl(proxyServerUrl, gitLabUsername);
  const responseData = await fetch(url);

  if (responseData.status === 401) {
    return {
      error: true,
      errorMessage: `Could not fetch the calendar of ${gitLabUsername}.`,
    };
  }

  return responseData.json()
    .then(parsedCalendar => ({
      parsedCalendar,
      error: false,
      errorMessage: null,
    }));
};
