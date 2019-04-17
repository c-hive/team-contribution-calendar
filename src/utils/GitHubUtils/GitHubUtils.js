/* eslint-disable no-console */

import { parse, parseSync } from 'svgson';
import * as Proxy from '../Proxy/Proxy';
import * as CalendarUtils from '../CalendarUtils/CalendarUtils';
import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';

const getUserSvg = async (proxyServerUrl, gitHubUsername) => {
  const userUrl = Proxy.getGitHubProxyUrl(proxyServerUrl, gitHubUsername);
  const responseData = await fetch(userUrl);

  return responseData.text()
    .then((body) => {
      const div = document.createElement('div');
      div.innerHTML = body;
      const rawUserSVG = div.querySelector('.js-calendar-graph-svg');

      return rawUserSVG;
    }).catch(err => console.log(err));
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
  let contributions = 0;

  userCalendar.children[0].children.forEach((weeklyData) => {
    weeklyData.children.forEach((dailyData) => {
      if (dailyData.attributes['data-count']) {
        contributions += Number(dailyData.attributes['data-count']);
      }
    });
  });

  return contributions;
};

export const getJsonFormattedCalendarSync = async (proxyServerUrl, gitHubUsername) => {
  const userSvg = await getUserSvg(proxyServerUrl, gitHubUsername);

  return parseSync(userSvg.outerHTML);
};

export const getJsonFormattedCalendarAsync = async (proxyServerUrl, gitHubUsername) => {
  const rawUserSvg = await getUserSvg(proxyServerUrl, gitHubUsername);

  return parse(rawUserSvg.outerHTML)
    .then(parsedGitHubCalendar => parsedGitHubCalendar)
    .catch(err => console.log(err));
};