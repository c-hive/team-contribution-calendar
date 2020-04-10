import $ from "elly";
import * as javaScriptUtils from "../JavaScriptUtils/JavaScriptUtils";

export const getFillColor = totalDailyContributions => {
  let fillColor = "#ebedf0";

  if (totalDailyContributions > 0 && totalDailyContributions < 10) {
    fillColor = "#c6e48b";
  }

  if (totalDailyContributions >= 10 && totalDailyContributions < 20) {
    fillColor = "#7bc96f";
  }

  if (totalDailyContributions >= 20 && totalDailyContributions < 30) {
    fillColor = "#239a3b";
  }

  if (totalDailyContributions >= 30) {
    fillColor = "#196127";
  }

  return fillColor;
};

export const getCalendarDataByIndexes = (calendarData, weekIndex, dayIndex) => {
  if (javaScriptUtils.isDefined(dayIndex)) {
    return calendarData.children[0].children[weekIndex].children[dayIndex];
  }

  return calendarData.children[0].children[weekIndex];
};

export const elementExists = selector => {
  const element = $(selector);

  return javaScriptUtils.isDefined(element);
};

export const filterContributionDays = (dailyData, timeframe) => {
  const isDay = dailyData.attributes.class === "day";

  // Weekdays and months displayed around the calendar should be disregarded.
  if (!isDay) {
    return false;
  }

  if (!timeframe.start && !timeframe.end) {
    return true;
  }

  const contributionsDate = new Date(dailyData.attributes["data-date"]);

  if (timeframe.start && !timeframe.end) {
    return contributionsDate >= new Date(timeframe.start);
  }

  if (!timeframe.start && timeframe.end) {
    return contributionsDate <= new Date(timeframe.end);
  }

  return (
    contributionsDate >= new Date(timeframe.start) &&
    contributionsDate <= new Date(timeframe.end)
  );
};
