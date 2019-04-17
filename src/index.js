import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';
import * as Proxy from './utils/Proxy/Proxy';
import * as Main from './Main/Main';

const index = (
  container,
  proxyServerUrl = Proxy.defaultProxyServerUrl,
  gitHubUsers,
) => {
  if (CalendarUtils.requiredParamsExist(container, gitHubUsers)) {
    Main.processParams(container, proxyServerUrl, gitHubUsers);
  } else {
    throw new Error('Please provide the required parameters in the appropriate format.');
  }
};

export default index;
