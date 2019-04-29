import * as CalendarUtils from "./utils/CalendarUtils/CalendarUtils";
import * as Proxy from "./utils/Proxy/Proxy";
import * as Main from "./Main/Main";

const index = (
  container,
  gitHubUsers = [],
  gitLabUsers = [],
  proxyServerUrl = Proxy.defaultProxyServerUrl
) => {
  if (CalendarUtils.requiredParamsExist(container, gitHubUsers, gitLabUsers)) {
    Main.processParams(container, gitHubUsers, gitLabUsers, proxyServerUrl);
  } else {
    throw new Error(
      "Please provide the required parameters in the appropriate format."
    );
  }
};

export default index;
