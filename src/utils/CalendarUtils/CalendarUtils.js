import { stringify } from 'svgson';
import * as GetStyledCalendarElement from '../GetStyledCalendarElement/GetStyledCalendarElement';
import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';

export const RequiredParamsExist = (container, gitHubUsers) => {
  if (!JavaScriptUtils.isDefined(container)) {
    return false;
  }

  if (!JavaScriptUtils.isDefined(gitHubUsers)) {
    return false;
  }

  return true;
};

export const RenderCalendarWithContributions = (container, calendar, totalContributions) => {
  const calendarContainer = GetStyledCalendarElement.container(container);
  const calendarHeader = GetStyledCalendarElement.header(totalContributions);

  const stringifiedHTMLContent = stringify(calendar);

  calendarContainer.innerHTML = stringifiedHTMLContent;
  calendarContainer.prepend(calendarHeader);
};
