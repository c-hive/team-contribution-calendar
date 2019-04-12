/* eslint-disable */

import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';
import * as Proxy from './utils/Proxy/Proxy';

const TeamContributionCalendar = (
  container,
  gitHubUsers,
  gitLabUsers = [],
  proxyUrl = Proxy.defaultProxyServerUrl,
) => {
  if (CalendarUtils.RequiredParamsExist(container, gitHubUsers)) {
    console.info('Params are OK.');
  } else {
    console.error('You must provide the required parameters in the appropriate format.');
  }
};

export default TeamContributionCalendar;
