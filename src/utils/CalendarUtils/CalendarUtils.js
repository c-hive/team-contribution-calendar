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
