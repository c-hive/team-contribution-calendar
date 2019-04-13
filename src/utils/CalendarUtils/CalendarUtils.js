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

export const RenderCalendarWithContributions = (container, calendar, contributionsValue) => {
  const calendarContainer = CreateCalendarElement.container(container);
  const calendarHeader = CreateCalendarElement.header();
  const calendarColorsList = CreateCalendarElement.colorsList();

  const contributionsValueDisplayer = document.createElement('P');
  contributionsValueDisplayer.innerText = `${contributionsValue} contributions in the last year`;

  calendarHeader.appendChild(contributionsValueDisplayer);
  calendarHeader.appendChild(calendarColorsList);

  const stringifiedHTMLContent = stringify(calendar);

  calendarContainer.innerHTML = stringifiedHTMLContent;
  calendarContainer.prepend(calendarHeader);
};
