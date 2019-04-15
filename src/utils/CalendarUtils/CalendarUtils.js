import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';
import * as Render from './Render/Render';
import * as DefaultUsers from '../../resources/DefaultUsers/DefaultUsers';
import BasicCalendar from '../../resources/BasicCalendar/BasicCalendar.json';
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

export const initializeBasicAppearance = async (container, proxyServerUrl) => {
  Render.calendarWithContributions(container, BasicCalendar, 0);

  const defaultUserJsonCalendar = await GitHub
    .getJsonFormattedCalendarSync(proxyServerUrl, DefaultUsers.GitHub);

  const restoredDefaultUserCalendar = GitHub.restoreCalendarValues(defaultUserJsonCalendar);

  Render.calendarWithContributions(container,
    restoredDefaultUserCalendar, 0);
};
