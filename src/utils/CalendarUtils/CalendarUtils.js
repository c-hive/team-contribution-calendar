import $ from "elly";
import produce from "immer";
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

export const filterByTimeframe = (dailyDataWithContributions, timeframe) => {
  if (!timeframe.start && !timeframe.end) {
    return dailyDataWithContributions;
  }

  const filtered = Object.entries(dailyDataWithContributions).filter(
    ([date]) => {
      const convertedDate = new Date(date);

      if (timeframe.start && !timeframe.end) {
        return convertedDate >= new Date(timeframe.start);
      }

      if (!timeframe.start && timeframe.end) {
        return convertedDate <= new Date(timeframe.end);
      }

      return (
        convertedDate >= new Date(timeframe.start) &&
        convertedDate <= new Date(timeframe.end)
      );
    }
  );

  return Object.fromEntries(filtered);
};

export const extractWeeksFromGitHub = calendar => {
  const lastWeekIndex = 53;

  return calendar.children[0].children.slice(0, lastWeekIndex);
};

export const aggregateCalendars = produce(
  (draft, dailyDataWithContributions) => {
    const weeks = extractWeeksFromGitHub(draft);

    weeks.forEach((week, weekIndex) => {
      week.children.forEach((day, dayIndex) => {
        const date = day.attributes["data-date"];

        if (date && dailyDataWithContributions[date]) {
          const dailyTotalContributions =
            Number(day.attributes["data-count"]) +
            Number(dailyDataWithContributions[day.attributes["data-date"]]);

          draft.children[0].children[weekIndex].children[dayIndex].attributes[
            "data-count"
          ] = dailyTotalContributions;
          draft.children[0].children[weekIndex].children[
            dayIndex
          ].attributes.fill = getFillColor(dailyTotalContributions);
        }
      });
    });
  }
);

export const aggregateContributions = dailyDataWithContributions =>
  Object.values(dailyDataWithContributions).reduce(
    (totalContributions, contribution) => totalContributions + contribution,
    0
  );
