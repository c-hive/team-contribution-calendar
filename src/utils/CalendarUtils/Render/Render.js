import { stringify } from 'svgson';
import * as GetStyledCalendarElement from '../../GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHub from '../GitHub/GitHub';
import * as DefaultUsers from '../../../resources/DefaultUsers/DefaultUsers';

export const calendarWithContributions = (calendarDetails) => {
  const calendarContainer = GetStyledCalendarElement.container(calendarDetails.container);
  const calendarHeader = GetStyledCalendarElement.header(
    calendarDetails.totalContributions, calendarDetails.isLoading,
  );

  const stringifiedHTMLContent = stringify(calendarDetails.actualCalendar);

  calendarContainer.innerHTML = stringifiedHTMLContent;
  calendarContainer.prepend(calendarHeader);
};

export const defaultUserCalendar = async (state) => {
  const defaultUserJsonCalendar = await GitHub.getJsonFormattedCalendarSync(
    state.configs.proxyServerUrl, DefaultUsers.GitHub,
  );

  const restoredDefaultUserCalendar = GitHub.restoreCalendarValues(defaultUserJsonCalendar);

  state.setStateAndRender({
    userTotalContributions: 0,
    updatedActualCalendar: restoredDefaultUserCalendar,
  });
};
