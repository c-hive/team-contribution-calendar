import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import State from '../resources/State/State';

// TODO: `generateCalendar`?
export const processParams = async (container, proxyServerUrl, gitHubUsers) => {
  const state = new State(container, proxyServerUrl, gitHubUsers);

  state.render();

  await CalendarUtils.Render.defaultUserCalendar(state);

  CalendarUtils.processStateUsers(state);
};
