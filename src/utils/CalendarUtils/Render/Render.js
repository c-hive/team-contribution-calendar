import { stringify } from 'svgson';
import * as GetStyledCalendarElement from '../../GetStyledCalendarElement/GetStyledCalendarElement';

export const calendarWithContributions = (container, calendar, totalContributions) => {
  const calendarContainer = GetStyledCalendarElement.container(container);
  const calendarHeader = GetStyledCalendarElement.header(totalContributions);

  const stringifiedHTMLContent = stringify(calendar);

  calendarContainer.innerHTML = stringifiedHTMLContent;
  calendarContainer.prepend(calendarHeader);
};
