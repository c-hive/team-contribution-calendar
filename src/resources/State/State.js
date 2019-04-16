import * as Render from '../../utils/CalendarUtils/Render/Render';
import * as JavaScriptUtils from '../../utils/JavaScriptUtils/JavaScriptUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';

export default class State {
  constructor(container, proxyServerUrl, gitHubUsers) {
    this.configs = {
      container,
      proxyServerUrl,
    };

    this.users = {
      gitHubUsers: [...gitHubUsers],
    };

    this.actualCalendar = { ...BasicCalendar };
    this.totalContributions = 0;
    this.isLoading = true;
  }

  render() {
    Render.calendarWithContributions({
      container: this.configs.container,
      actualCalendar: this.actualCalendar,
      totalContributions: this.totalContributions,
      isLoading: this.isLoading,
    });
  }

  setStateAndRender(data) {
    const { userTotalContributions, updatedActualCalendar } = data;

    if (JavaScriptUtils.isDefined(data.isLoading)) {
      this.isLoading = data.isLoading;
    }

    this.actualCalendar = {
      ...updatedActualCalendar,
    };

    this.totalContributions = this.totalContributions + userTotalContributions;

    this.render();
  }
}
