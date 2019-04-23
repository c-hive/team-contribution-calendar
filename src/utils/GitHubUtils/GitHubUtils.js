/* eslint-disable no-console */

import { parse, parseSync } from 'svgson';
import * as Proxy from '../Proxy/Proxy';
import * as CalendarUtils from '../CalendarUtils/CalendarUtils';
import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';

const getUserSvg = async (proxyServerUrl, gitHubUsername) => {
  const userUrl = Proxy.getGitHubProxyUrl(proxyServerUrl, gitHubUsername);
  const responseData = await fetch(userUrl);

  if (JavaScriptUtils.isSuccess(responseData.status)) {
    return responseData.text()
      .then((body) => {
        const div = document.createElement('div');
        div.innerHTML = body;
        const rawUserSvg = div.querySelector('.js-calendar-graph-svg');

        return {
          rawUserSvg,
          error: false,
        };
      });
  }

  return {
    rawUserSvg: null,
    error: true,
  };
};

export const setEmptyCalendarValues = (calendar) => {
  const copiedCalendar = JavaScriptUtils.deepCopyObject(calendar);

  copiedCalendar.children[0].children.forEach((weeklyData, weekIndex) => {
    weeklyData.children.forEach((dailyData, dayIndex) => {
      copiedCalendar.children[0].children[weekIndex].children[dayIndex].attributes = {
        ...dailyData.attributes,
        'data-count': '0',
        fill: '#ebedf0',
      };
    });
  });

  return copiedCalendar;
};

export const mergeCalendarsContributions = (actualCalendar, gitHubUserJsonCalendar) => {
  const copiedActualCalendar = JavaScriptUtils.deepCopyObject(actualCalendar);

  gitHubUserJsonCalendar.children[0].children.forEach((weeklyData, weekIndex) => {
    weeklyData.children.forEach((dailyData, dayIndex) => {
      if (dailyData.attributes['data-count']) {
        const actualCalendarDailyData = CalendarUtils
          .getCalendarDataByIndexes(copiedActualCalendar, weekIndex, dayIndex);
        const totalDailyContributions = Number(actualCalendarDailyData.attributes['data-count']) + Number(dailyData.attributes['data-count']);

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

export const getLastYearContributions = (userCalendar) => {
  let lastYearContributions = 0;

  userCalendar.children[0].children.forEach((weeklyData) => {
    weeklyData.children.forEach((dailyData) => {
      if (dailyData.attributes['data-count']) {
        lastYearContributions += Number(dailyData.attributes['data-count']);
      }
    });
  });

  return lastYearContributions;
};

export const getJsonFormattedCalendarSync = async (proxyServerUrl, gitHubUsername) => {
  const userData = await getUserSvg(proxyServerUrl, gitHubUsername);

  if (userData.error) {
    return {
      ...userData,
      errorMessage: 'Could not fetch the calendar of the default user.',
    };
  }

  const parsedCalendar = parseSync(userData.rawUserSvg.outerHTML);

  return {
    parsedCalendar,
    error: false,
    errorMessage: null,
  };
};

export const getJsonFormattedCalendarAsync = async (proxyServerUrl, gitHubUsername) => {
  const userData = await getUserSvg(proxyServerUrl, gitHubUsername);

  if (userData.error) {
    return {
      ...userData,
      errorMessage: `Could not fetch the calendar of ${gitHubUsername}.`,
    };
  }

  return parse(userData.rawUserSvg.outerHTML)
    .then(parsedGitHubCalendar => ({
      parsedCalendar: parsedGitHubCalendar,
      error: false,
      errorMessage: null,
    }));
};
