import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';

export const requiredParamsExist = (container, gitHubUsers, gitLabUsers) => {
  if (!JavaScriptUtils.isDefined(container)) {
    return false;
  }

  const userArraysAreEmpty = gitHubUsers.length === 0 && gitLabUsers.length === 0;

  if (userArraysAreEmpty) {
    return false;
  }

  return true;
};

export const getFillColor = (totalDailyContributions) => {
  let fillColor = '#ebedf0';

  if (totalDailyContributions > 0 && totalDailyContributions < 10) {
    fillColor = '#c6e48b';
  }

  if (totalDailyContributions >= 10 && totalDailyContributions < 20) {
    fillColor = '#7bc96f';
  }

  if (totalDailyContributions >= 20 && totalDailyContributions < 30) {
    fillColor = '#239a3b';
  }

  if (totalDailyContributions >= 30) {
    fillColor = '#196127';
  }

  return fillColor;
};

export const getCalendarDataByIndexes = (calendarData, weekIndex, dayIndex) => {
  if (JavaScriptUtils.isDefined(dayIndex)) {
    return calendarData.children[0].children[weekIndex].children[dayIndex];
  }

  return calendarData.children[0].children[weekIndex];
};
