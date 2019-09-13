import * as calendarUtils from "./utils/CalendarUtils/CalendarUtils";
import * as proxy from "./utils/Proxy/Proxy";
import * as main from "./Main/Main";

const index = (
  container,
  gitHubUsers = [],
  gitLabUsers = [],
  proxyServerUrl = proxy.defaultProxyServerUrl
) => {
  if (calendarUtils.requiredParamsExist(container, gitHubUsers, gitLabUsers)) {
    main.processParams(container, gitHubUsers, gitLabUsers, proxyServerUrl);
  } else {
    throw new Error(
      "Please provide the required parameters in the appropriate format."
    );
  }
};

export default index;
