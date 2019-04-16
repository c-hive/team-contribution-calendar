/* eslint-disable no-console */

import { parseSync, parse } from 'svgson';
import * as Proxy from '../../Proxy/Proxy';
import * as JavaScriptUtils from '../../JavaScriptUtils/JavaScriptUtils';
import * as Common from '../Common/Common';

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

export const restoreCalendarValues = (calendar) => {
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

export const getMergedCalendars = (actualCalendar, userJsonCalendar) => {
  const copiedActualCalendar = JavaScriptUtils.deepCopyObject(actualCalendar);

  userJsonCalendar.children[0].children.forEach((weeklyData, weekIndex) => {
    weeklyData.children.forEach((dailyData, dayIndex) => {
      if (dailyData.attributes['data-count']) {
        const actualCalendarDailyData = Common
          .getCalendarDataByIndexes(copiedActualCalendar, weekIndex, dayIndex);
        const totalDailyContributions = Number(actualCalendarDailyData.attributes['data-count']) + Number(dailyData.attributes['data-count']);

        copiedActualCalendar.children[0].children[weekIndex].children[dayIndex].attributes = {
          ...actualCalendarDailyData.attributes,
          'data-count': String(totalDailyContributions),
          fill: Common.getFillColor(totalDailyContributions),
        };
      }
    });
  });

  return copiedActualCalendar;
};

export const getUserTotalContributions = (userJsonCalendar) => {
  let sum = 0;

  userJsonCalendar.children[0].children.forEach((weeklyData) => {
    weeklyData.children.forEach((dailyData) => {
      if (dailyData.attributes['data-count']) {
        sum += Number(dailyData.attributes['data-count']);
      }
    });
  });

  return sum;
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
