import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import { State } from '../resources/State/State';

export const processParams = async (container, proxyServerUrl) => {
  const state = new State();

  await CalendarUtils.initializeBasicAppearance(state, container, proxyServerUrl);
};
