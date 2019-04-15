import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';
import * as Render from './Render/Render';
import * as DefaultUsers from '../../resources/DefaultUsers/DefaultUsers';
import * as GitHub from './GitHub/GitHub';

export const requiredParamsExist = (container, gitHubUsers) => {
  if (!JavaScriptUtils.isDefined(container)) {
    return false;
  }

  if (!JavaScriptUtils.isDefined(gitHubUsers)) {
    return false;
  }

  return true;
};

export const initializeBasicAppearance = async (state, container, proxyServerUrl) => {
  Render.calendarWithContributions(container, state.actualCalendar, state.totalContributions);

  const defaultUserJsonCalendar = await GitHub
    .getJsonFormattedCalendarSync(proxyServerUrl, DefaultUsers.GitHub);

  const restoredDefaultUserCalendar = GitHub.restoreCalendarValues(defaultUserJsonCalendar);

  state.setState({
    currentUserTotalContributions: 0,
    updatedActualCalendar: restoredDefaultUserCalendar,
  });

  Render.calendarWithContributions(container,
    state.actualCalendar, state.totalContributions);
};
