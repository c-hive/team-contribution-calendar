import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import State from '../resources/State/State';

export const processParams = async (container, proxyServerUrl) => {
  const state = new State(container, proxyServerUrl);

  state.render();

  await CalendarUtils.Render.defaultUserCalendar(state);
};
