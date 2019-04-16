import * as JavaScriptUtils from '../JavaScriptUtils/JavaScriptUtils';
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

export { Render };
