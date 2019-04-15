import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import BasicCalendar from '../resources/BasicCalendar/BasicCalendar.json';

export const processParams = (container) => {
  CalendarUtils.RenderCalendarWithContributions(container, BasicCalendar, 0);
};
