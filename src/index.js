import * as Main from './Main/Main';
import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';
import * as Proxy from './utils/Proxy/Proxy';

// https://github.com/babel/babel/issues/9819
// https://github.com/babel/gulp-babel/issues/50#issuecomment-255606255

const TeamContributionCalendar = (
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

export default TeamContributionCalendar;
