import { stringify } from 'svgson';
import * as GetStyledCalendarElement from '../../utils/GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHubUtils from '../../utils/GitHubUtils/GitHubUtils';
import * as JavaScriptUtils from '../../utils/JavaScriptUtils/JavaScriptUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';
import * as DefaultUsers from '../DefaultUsers/DefaultUsers';

export default class TeamContributionCalendar {
  constructor(container, gitHubUsers, proxyServerUrl) {
    this.configs = {
      container,
      proxyServerUrl,
    };

    this.users = {
      gitHub: [...gitHubUsers],
    };

    this.actualCalendar = BasicCalendar;
    this.totalContributions = 0;
    this.isLoading = true;
  }

  async renderBasicAppearance() {
    this.renderActualCalendar();

    const defaultUserJsonCalendar = await GitHubUtils.getJsonFormattedCalendarSync(
      this.configs.proxyServerUrl, DefaultUsers.GitHub,
    );

    const defaultUserEmptyCalendar = GitHubUtils.setEmptyCalendarValues(defaultUserJsonCalendar);

    this.updateCalendar({
      contributions: 0,
      newActualCalendar: defaultUserEmptyCalendar,
    });
  }

  updateCalendar(data) {
    const { contributions, newActualCalendar } = data;

    if (JavaScriptUtils.isDefined(data.isLoading)) {
      this.isLoading = data.isLoading;
    }

    this.actualCalendar = {
      ...newActualCalendar,
    };

    this.totalContributions = this.totalContributions + contributions;

    this.renderActualCalendar();
  }

  renderActualCalendar() {
    const calendarContainer = GetStyledCalendarElement.container(this.configs.container);
    const calendarHeader = GetStyledCalendarElement.header(this.totalContributions, this.isLoading);

    const stringifiedHTMLContent = stringify(this.actualCalendar);

    calendarContainer.innerHTML = stringifiedHTMLContent;
    calendarContainer.prepend(calendarHeader);
  }

  aggregateUserCalendars() {
    this.users.gitHub.map(async (gitHubUsername) => {
      const gitHubUserJsonCalendar = await GitHubUtils.getJsonFormattedCalendarAsync(
        this.configs.proxyServerUrl, gitHubUsername,
      );

      this.processGitHubCalendar(gitHubUserJsonCalendar);
    });
  }

  processGitHubCalendar(gitHubUserJsonCalendar) {
    const newActualCalendar = GitHubUtils.mergeCalendarsContributions(
      this.actualCalendar, gitHubUserJsonCalendar,
    );

    const lastYearContributions = GitHubUtils.getLastYearContributions(gitHubUserJsonCalendar);

    this.updateCalendar({
      newActualCalendar,
      contributions: lastYearContributions,
      isLoading: false,
    });
  }
}
