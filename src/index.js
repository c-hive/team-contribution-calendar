import * as Main from './main/main';
import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';
import * as Proxy from './utils/Proxy/Proxy';

const TeamContributionCalendar = (
  container,
  gitHubUsers,
  gitLabUsers = [],
  proxyUrl = Proxy.defaultProxyServerUrl,
) => {
  if (CalendarUtils.RequiredParamsExist(container, gitHubUsers)) {
    Main.processData(container, gitHubUsers, gitLabUsers, proxyUrl);
  } else {
    throw new Error('Please provide the required parameters in the appropriate format.');
  }
};

export default TeamContributionCalendar;
