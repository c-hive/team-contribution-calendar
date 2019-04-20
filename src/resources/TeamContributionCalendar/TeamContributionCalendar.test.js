import { expect } from 'chai';
import sinon from 'sinon';
import TeamContributionCalendar from './TeamContributionCalendar';
import * as GetStyledCalendarElement from '../../utils/GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHubUtils from '../../utils/GitHubUtils/GitHubUtils';
import * as GitLabUtils from '../../utils/GitLabUtils/GitLabUtils';
import * as TestUtils from '../../utils/TestUtils/TestUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';
import * as DefaultUsers from '../DefaultUsers/DefaultUsers';

describe('TeamContributionCalendar', () => {
  const sandbox = sinon.createSandbox();

  let teamContributionCalendar;

  const testParams = TestUtils.getTestParams();

  beforeEach(() => {
    teamContributionCalendar = new TeamContributionCalendar(
      testParams.container,
      testParams.gitHubUsers,
      testParams.gitLabUsers,
      testParams.proxyServerUrl,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('sets the given container and proxy server url into `configs`', () => {
    const expectedConfig = {
      container: testParams.container,
      proxyServerUrl: testParams.proxyServerUrl,
    };

    expect(teamContributionCalendar.configs).to.eql(expectedConfig);
  });

  it('sets the GH and GL users into `users`', () => {
    const expectedUsers = {
      gitHub: [...testParams.gitHubUsers],
      gitLab: [...testParams.gitLabUsers],
    };

    expect(teamContributionCalendar.users).to.eql(expectedUsers);
  });

  it('sets the actual calendar to `BasicCalendar` by default', () => {
    expect(teamContributionCalendar.actualCalendar).to.equal(BasicCalendar);
  });

  it('sets the total contributions to 0 by default', () => {
    expect(teamContributionCalendar.totalContributions).to.equal(0);
  });

  it('sets `isLoading` to true by default', () => {
    expect(teamContributionCalendar.isLoading).to.equal(true);
  });

  describe('renderActualCalendar', () => {
    let containerStub;
    let headerStub;

    let appendChildSpy;
    let prependSpy;

    let calendarContainer;
    let calendarHeader;

    beforeEach(() => {
      appendChildSpy = sandbox.spy();
      prependSpy = sandbox.spy();

      calendarContainer = {
        prepend: prependSpy,
        innerHTML: null,
      };

      calendarHeader = {
        appendChild: appendChildSpy,
      };

      containerStub = sandbox.stub(GetStyledCalendarElement, 'container').returns(calendarContainer);
      headerStub = sandbox.stub(GetStyledCalendarElement, 'header').returns(calendarHeader);
    });

    it('renders the styled container into the given element', () => {
      teamContributionCalendar.renderActualCalendar();

      expect(containerStub.calledWithExactly(
        teamContributionCalendar.configs.container,
      )).to.equal(true);
    });

    it('gets the styled calendar header', () => {
      teamContributionCalendar.renderActualCalendar();

      expect(headerStub.calledWithExactly(
        teamContributionCalendar.totalContributions,
        teamContributionCalendar.isLoading,
      )).to.equal(true);
    });

    it('prepends the header to the container', () => {
      teamContributionCalendar.renderActualCalendar();

      expect(calendarContainer.prepend.calledWithExactly(
        calendarHeader,
      )).to.equal(true);
    });
  });

  describe('renderBasicAppearance', () => {
    let renderActualCalendarStub;
    let getJsonFormattedCalendarSyncStub;
    let setEmptyCalendarValuesStub;
    let updateCalendarStub;

    const defaultUserJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2019-01-20': 12,
    });
    const defaultUserEmptyCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2019-01-20': 0,
    });

    beforeEach(() => {
      getJsonFormattedCalendarSyncStub = sandbox.stub(GitHubUtils, 'getJsonFormattedCalendarSync').returns(defaultUserJsonCalendar);
      setEmptyCalendarValuesStub = sandbox.stub(GitHubUtils, 'setEmptyCalendarValues').returns(defaultUserEmptyCalendar);

      renderActualCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'renderActualCalendar');
      updateCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'updateCalendar');
    });

    it('renders the default calendar(`BasicCalendar`)', () => {
      teamContributionCalendar.renderBasicAppearance();

      expect(renderActualCalendarStub.calledOnce).to.equal(true);
    });

    it('fetches the default GH user`s calendar synchronously', async () => {
      await teamContributionCalendar.renderBasicAppearance();

      expect(getJsonFormattedCalendarSyncStub.calledWithExactly(
        teamContributionCalendar.configs.proxyServerUrl,
        DefaultUsers.GitHub,
      )).to.equal(true);
    });

    it('sets the fetched default GH user`s calendar values to empty ones', async () => {
      await teamContributionCalendar.renderBasicAppearance();

      expect(setEmptyCalendarValuesStub.calledWithExactly(
        defaultUserJsonCalendar,
      )).to.equal(true);
    });

    it('calls `updateCalendar` with the empty default user calendar and 0 contributions', async () => {
      const expectedCalledCalendarDetails = {
        contributions: 0,
        updatedActualCalendar: defaultUserEmptyCalendar,
      };

      await teamContributionCalendar.renderBasicAppearance();

      expect(updateCalendarStub.calledWithExactly(
        expectedCalledCalendarDetails,
      )).to.equal(true);
    });
  });

  describe('updateCalendar', () => {
    let renderActualCalendarStub;

    const data = {
      contributions: 1024,
      updatedActualCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts({
        '2018-10-10': 12,
      }),
    };

    beforeEach(() => {
      renderActualCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'renderActualCalendar');
    });

    describe('when `isLoading` is not defined', () => {
      const dataWithoutIsLoading = {
        ...data,
      };

      it('does not update `isLoading`', () => {
        const expectedIsLoadingValue = teamContributionCalendar.isLoading;

        teamContributionCalendar.updateCalendar(dataWithoutIsLoading);

        expect(teamContributionCalendar.isLoading).to.equal(expectedIsLoadingValue);
      });
    });

    describe('when `isLoading` is defined', () => {
      const dataWithIsLoading = {
        ...data,
        isLoading: false,
      };

      it('updates `isLoading` to the received value', () => {
        teamContributionCalendar.updateCalendar(dataWithIsLoading);

        expect(teamContributionCalendar.isLoading).to.equal(dataWithIsLoading.isLoading);
      });
    });

    it('sets the updated actual calendar', () => {
      teamContributionCalendar.updateCalendar(data);

      expect(teamContributionCalendar.actualCalendar).to.eql(data.updatedActualCalendar);
    });

    it('adds the received contributions to the current total contributions', () => {
      const expectedTotalContributions = teamContributionCalendar.totalContributions
        + data.contributions;

      teamContributionCalendar.updateCalendar(data);

      expect(teamContributionCalendar.totalContributions).to.equal(expectedTotalContributions);
    });

    it('re-renders the calendar based on the new values', () => {
      teamContributionCalendar.updateCalendar(data);

      expect(renderActualCalendarStub.calledOnce).to.equal(true);
    });
  });

  describe('aggregateUserCalendars', () => {
    // All the related functions should be mocked before
    // because they're being called simultaneously within `aggregateUserCalendars`.
    // Otherwise, it'd raise `fetch is not defined` errors.
    // See https://github.com/c-hive/team-contribution-calendar/issues/17.
    let gitHubGetJsonFormattedCalendarAsyncStub;
    let gitLabGetJsonFormattedCalendarAsyncStub;
    let processGitHubCalendarStub;
    let processGitLabCalendarStub;

    beforeEach(() => {
      gitHubGetJsonFormattedCalendarAsyncStub = sandbox.stub(GitHubUtils, 'getJsonFormattedCalendarAsync');
      gitLabGetJsonFormattedCalendarAsyncStub = sandbox.stub(GitLabUtils, 'getJsonFormattedCalendarAsync');

      processGitHubCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'processGitHubCalendar');
      processGitLabCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'processGitLabCalendar');
    });

    describe('GitHub', () => {
      const gitHubUserJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
        '2019-03-19': 5,
        '2019-03-20': 5,
      });

      beforeEach(() => {
        gitHubGetJsonFormattedCalendarAsyncStub.returns(gitHubUserJsonCalendar);
      });

      it('fetches the GH user calendars asynchronously', () => {
        const expectedCalledTimes = teamContributionCalendar.users.gitHub.length;

        teamContributionCalendar.aggregateUserCalendars();

        expect(gitHubGetJsonFormattedCalendarAsyncStub.callCount).to.equal(expectedCalledTimes);
      });

      it('processes the fetched GH user calendars', async () => {
        await teamContributionCalendar.aggregateUserCalendars();

        expect(processGitHubCalendarStub.calledWithExactly(
          gitHubUserJsonCalendar,
        )).to.equal(true);
      });
    });

    describe('GitLab', () => {
      const gitLabUserJsonCalendar = {
        '2018-02-03': 7,
        '2018-02-09': 3,
      };

      beforeEach(() => {
        gitLabGetJsonFormattedCalendarAsyncStub.returns(gitLabUserJsonCalendar);
      });

      it('fetches the GL user calendars asynchronously', () => {
        const expectedCalledTimes = teamContributionCalendar.users.gitLab.length;

        teamContributionCalendar.aggregateUserCalendars();

        expect(gitLabGetJsonFormattedCalendarAsyncStub.callCount).to.equal(expectedCalledTimes);
      });

      it('processes the fetched GL user calendars', async () => {
        await teamContributionCalendar.aggregateUserCalendars();

        expect(processGitLabCalendarStub.calledWithExactly(
          gitLabUserJsonCalendar,
        )).to.equal(true);
      });
    });
  });

  describe('processGitHubCalendar', () => {
    let mergeCalendarsContributionsStub;
    let getLastYearContributionsStub;
    let updateCalendarStub;

    const gitHubUserJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2019-03-10': 15,
      '2019-03-12': 5,
    });
    const updatedActualCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2019-03-10': 18,
      '2019-03-11': 15,
      '2019-03-12': 7,
    });
    const lastYearContributions = 1024;

    beforeEach(() => {
      mergeCalendarsContributionsStub = sandbox.stub(GitHubUtils, 'mergeCalendarsContributions').returns(updatedActualCalendar);
      getLastYearContributionsStub = sandbox.stub(GitHubUtils, 'getLastYearContributions').returns(lastYearContributions);

      updateCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'updateCalendar');
    });

    it('merges the actual calendar contributions into the GH user`s contributions', () => {
      teamContributionCalendar.processGitHubCalendar(gitHubUserJsonCalendar);

      expect(mergeCalendarsContributionsStub.calledWithExactly(
        teamContributionCalendar.actualCalendar,
        gitHubUserJsonCalendar,
      )).to.equal(true);
    });

    it('calculates the user`s last year contributions', () => {
      teamContributionCalendar.processGitHubCalendar(gitHubUserJsonCalendar);

      expect(getLastYearContributionsStub.calledWithExactly(
        gitHubUserJsonCalendar,
      )).to.equal(true);
    });

    it('calls `updateCalendar` with the updated actual calendar, the calculated last year contributions and `isLoading` false', () => {
      const expectedUpdatedData = {
        updatedActualCalendar,
        contributions: lastYearContributions,
        isLoading: false,
      };

      teamContributionCalendar.processGitHubCalendar(gitHubUserJsonCalendar);

      expect(updateCalendarStub.calledWithExactly(expectedUpdatedData)).to.equal(true);
    });
  });

  describe('processGitLabCalendar', () => {
    let mergeCalendarsContributionsStub;
    let getLastYearContributionsStub;
    let updateCalendarStub;

    const gitLabUserJsonCalendar = {
      '2018-02-03': 7,
      '2018-02-09': 3,
    };

    const updatedActualCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2018-02-03': 11,
      '2018-02-09': 20,
    });

    const lastYearContributions = 2048;

    beforeEach(() => {
      mergeCalendarsContributionsStub = sandbox.stub(GitLabUtils, 'mergeCalendarsContributions').returns(updatedActualCalendar);
      getLastYearContributionsStub = sandbox.stub(GitLabUtils, 'getLastYearContributions').returns(lastYearContributions);

      updateCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'updateCalendar');
    });

    it('merges the actual calendar contributions into the GL user`s contributions', () => {
      teamContributionCalendar.processGitLabCalendar(gitLabUserJsonCalendar);

      expect(mergeCalendarsContributionsStub.calledWithExactly(
        teamContributionCalendar.actualCalendar,
        gitLabUserJsonCalendar,
      )).to.equal(true);
    });

    it('calculates the user`s last year contributions', () => {
      teamContributionCalendar.processGitLabCalendar(gitLabUserJsonCalendar);

      expect(getLastYearContributionsStub.calledWithExactly(
        gitLabUserJsonCalendar,
      )).to.equal(true);
    });

    it('calls `updateCalendar` with the updated actual calendar, the calculated last year contributions and `isLoading` false', () => {
      const expectedUpdatedData = {
        updatedActualCalendar,
        contributions: lastYearContributions,
        isLoading: false,
      };

      teamContributionCalendar.processGitLabCalendar(gitLabUserJsonCalendar);

      expect(updateCalendarStub.calledWithExactly(expectedUpdatedData)).to.equal(true);
    });
  });
});
