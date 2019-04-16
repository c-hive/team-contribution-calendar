import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';
import * as GitHub from './GitHub/GitHub';
import * as Render from './Render/Render';

export const requiredParamsExist = (container, gitHubUsers) => {
  if (!JavaScriptUtils.isDefined(container)) {
    return false;
  }

  if (!JavaScriptUtils.isDefined(gitHubUsers)) {
    return false;
  }

  return true;
};

export const processStateUsers = (state) => {
  state.users.gitHubUsers.map(async (gitHubUsername) => {
    const userJsonCalendar = await GitHub.getJsonFormattedCalendarAsync(
      state.configs.proxyServerUrl, gitHubUsername,
    );

    const mergedCalendars = GitHub.getMergedCalendars(state.actualCalendar, userJsonCalendar);
    const userTotalContributions = GitHub.getUserTotalContributions(userJsonCalendar);

    state.setStateAndRender({
      updatedActualCalendar: mergedCalendars,
      userTotalContributions,
      isLoading: false,
    });
  });
};

export { Render };
