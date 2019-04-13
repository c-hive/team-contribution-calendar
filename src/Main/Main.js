import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import BasicCalendar from '../resources/BasicCalendar/BasicCalendar.json';

// eslint-disable-next-line no-unused-vars
export const processParams = (container, gitHubUsers, gitLabUsers, proxyUrl) => {
  CalendarUtils.RenderCalendarWithContributions(container, BasicCalendar, 0);
};
