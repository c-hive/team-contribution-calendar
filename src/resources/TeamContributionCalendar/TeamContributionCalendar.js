import { stringify } from 'svgson';
import * as GetStyledCalendarElement from '../../utils/GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHubUtils from '../../utils/GitHubUtils/GitHubUtils';
import * as GitLabUtils from '../../utils/GitLabUtils/GitLabUtils';
import * as JavaScriptUtils from '../../utils/JavaScriptUtils/JavaScriptUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';
import * as DefaultUsers from '../DefaultUsers/DefaultUsers';

export default class TeamContributionCalendar {
  constructor(container, gitHubUsers, gitLabUsers, proxyServerUrl) {
    this.configs = {
      container,
      proxyServerUrl,
    };

    this.users = {
      gitHub: [...gitHubUsers],
      gitLab: [...gitLabUsers],
    };

    this.actualCalendar = BasicCalendar;
    this.totalContributions = 0;
    this.isLoading = true;
  }

  async renderBasicAppearance() {
    this.renderActualCalendar();

    try {
      const defaultUserJsonCalendar = await GitHubUtils.getJsonFormattedCalendarSync(
        this.configs.proxyServerUrl, DefaultUsers.GitHub,
      );

      const defaultUserEmptyCalendar = GitHubUtils.setEmptyCalendarValues(defaultUserJsonCalendar);

      this.updateCalendar({
        contributions: 0,
        updatedActualCalendar: defaultUserEmptyCalendar,
      });
    } catch {
      this.updateCalendar({
        isLoading: false,
      });

      throw new Error('Could not load the calendar of the default user. The issue might be related to the cors-proxy server.');
    }
  }

  updateCalendar(data) {
    if (JavaScriptUtils.isDefined(data.isLoading)) {
      this.isLoading = data.isLoading;
    }

    if (JavaScriptUtils.isDefined(data.updatedActualCalendar)) {
      const { contributions, updatedActualCalendar } = data;

      this.actualCalendar = {
        ...updatedActualCalendar,
      };

      this.totalContributions = this.totalContributions + contributions;
    }

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

    this.users.gitLab.map(async (gitLabUsername) => {
      const gitLabUserJsonCalendar = await GitLabUtils.getJsonFormattedCalendarAsync(
        this.configs.proxyServerUrl, gitLabUsername,
      );

      this.processGitLabCalendar(gitLabUserJsonCalendar);
    });
  }

  processGitHubCalendar(gitHubUserJsonCalendar) {
    const updatedActualCalendar = GitHubUtils.mergeCalendarsContributions(
      this.actualCalendar, gitHubUserJsonCalendar,
    );

    const lastYearContributions = GitHubUtils.getLastYearContributions(gitHubUserJsonCalendar);

    this.updateCalendar({
      updatedActualCalendar,
      contributions: lastYearContributions,
      isLoading: false,
    });
  }

  processGitLabCalendar(gitLabUserJsonCalendar) {
    const updatedActualCalendar = GitLabUtils.mergeCalendarsContributions(
      this.actualCalendar, gitLabUserJsonCalendar,
    );

    const lastYearContributions = GitLabUtils.getLastYearContributions(gitLabUserJsonCalendar);

    this.updateCalendar({
      updatedActualCalendar,
      contributions: lastYearContributions,
      isLoading: false,
    });
  }
}
