import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';

export const processParams = async (container, proxyServerUrl) => {
  await CalendarUtils.initializeBasicAppearance(container, proxyServerUrl);
};
