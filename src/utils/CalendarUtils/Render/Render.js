import { stringify } from 'svgson';
import * as GetStyledCalendarElement from '../../GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHub from '../GitHub/GitHub';
import * as DefaultUsers from '../../../resources/DefaultUsers/DefaultUsers';

export const calendarWithContributions = (container, calendar, totalContributions) => {
  const calendarContainer = GetStyledCalendarElement.container(container);
  const calendarHeader = GetStyledCalendarElement.header(totalContributions);

  const stringifiedHTMLContent = stringify(calendar);

  calendarContainer.innerHTML = stringifiedHTMLContent;
  calendarContainer.prepend(calendarHeader);
};

export const defaultUserCalendar = async (state) => {
  const defaultUserJsonCalendar = await GitHub.getJsonFormattedCalendarSync(
    state.configs.proxyServerUrl, DefaultUsers.GitHub,
  );

  const restoredDefaultUserCalendar = GitHub.restoreCalendarValues(defaultUserJsonCalendar);

  state.setStateAndRender({
    currentUserTotalContributions: 0,
    updatedActualCalendar: restoredDefaultUserCalendar,
  });
};
