import BasicCalendar from '../BasicCalendar/BasicCalendar.json';
import * as Render from '../../utils/CalendarUtils/Render/Render';

export default class State {
  constructor(container, proxyServerUrl) {
    this.configs = {
      container,
      proxyServerUrl,
    };

    this.actualCalendar = BasicCalendar;
    this.totalContributions = 0;
    this.isLoading = true;
  }

  render() {
    Render.calendarWithContributions(
      this.configs.container,
      this.actualCalendar,
      this.totalContributions,
    );
  }

  setStateAndRender(data) {
    const { currentUserTotalContributions, updatedActualCalendar } = data;

    this.actualCalendar = {
      ...updatedActualCalendar,
    };

    this.totalContributions = this.totalContributions + currentUserTotalContributions;

    this.render();
  }
}
