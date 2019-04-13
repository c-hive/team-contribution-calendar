import { stringify } from 'svgson';
import * as CreateCalendarElement from '../CreateCalendarElement/CreateCalendarElement';
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
  const calendarContainer = CreateCalendarElement.container(container);
  const calendarHeader = CreateCalendarElement.header(totalContributions);

  const stringifiedHTMLContent = stringify(calendar);

  calendarContainer.innerHTML = stringifiedHTMLContent;
  calendarContainer.prepend(calendarHeader);
};
