import { stringify } from 'svgson';
import * as GetCalendarElement from '../GetCalendarElement/GetCalendarElement';
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
  const calendarContainer = GetCalendarElement.container(container);
  const calendarHeader = GetCalendarElement.header(totalContributions);

  const stringifiedHTMLContent = stringify(calendar);

  calendarContainer.innerHTML = stringifiedHTMLContent;
  calendarContainer.prepend(calendarHeader);
};
