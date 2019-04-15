/* eslint-disable no-console */

import { parseSync } from 'svgson';
import * as Proxy from '../../Proxy/Proxy';
import * as JavaScriptUtils from '../../JavaScriptUtils/JavaScriptUtils';

const getCurrentUserSvg = async (proxyServerUrl, gitHubUsername) => {
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

export const getJsonFormattedCalendarSync = async (proxyServerUrl, gitHubUsername) => {
  const userCalendar = await getCurrentUserSvg(proxyServerUrl, gitHubUsername);

  return parseSync(userCalendar.outerHTML);
};
