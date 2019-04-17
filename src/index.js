import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';
import * as Proxy from './utils/Proxy/Proxy';
import * as Main from './Main/Main';

const index = (
  container,
  gitHubUsers,
  proxyServerUrl = Proxy.defaultProxyServerUrl,
) => {
  if (CalendarUtils.requiredParamsExist(container, gitHubUsers)) {
    Main.processParams(container, proxyServerUrl);
  } else {
    throw new Error('Please provide the required parameters in the appropriate format.');
  }
};

export default index;
