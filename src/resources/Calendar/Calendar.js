import { stringify } from 'svgson';
import * as GetStyledCalendarElement from '../../utils/GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHubUtils from '../../utils/GitHubUtils/GitHubUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';
import * as DefaultUsers from '../DefaultUsers/DefaultUsers';

export default class Calendar {
  constructor(container, proxyServerUrl) {
    this.configs = {
      container,
      proxyServerUrl,
    };

    this.actualCalendar = BasicCalendar;
    this.totalContributions = 0;
    this.isLoading = true;
  }

  renderActualCalendar() {
    const calendarContainer = GetStyledCalendarElement.container(this.configs.container);
    const calendarHeader = GetStyledCalendarElement.header(this.totalContributions);

    const stringifiedHTMLContent = stringify(this.actualCalendar);

    calendarContainer.innerHTML = stringifiedHTMLContent;
    calendarContainer.prepend(calendarHeader);
  }

  async renderBasicAppearance() {
    // In order to render the basic calendar before the sync fetching.
    this.renderActualCalendar();

    const defaultUserJsonCalendar = await GitHubUtils.getJsonFormattedCalendarSync(
      this.configs.proxyServerUrl, DefaultUsers.GitHub,
    );

    const defaultUserEmptyCalendar = GitHubUtils.setEmptyCalendarValues(defaultUserJsonCalendar);

    this.updateCalendarDetails({
      updatedActualCalendar: defaultUserEmptyCalendar,
      currentUserTotalContributions: 0,
    });
  }

  updateCalendarDetails(data) {
    const { currentUserTotalContributions, updatedActualCalendar } = data;

    this.actualCalendar = {
      ...updatedActualCalendar,
    };

    this.totalContributions = this.totalContributions + currentUserTotalContributions;

    this.renderActualCalendar();
  }
}
