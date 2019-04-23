import { expect } from 'chai';
import sinon from 'sinon';
import jsdom from 'mocha-jsdom';
import TeamContributionCalendar from './TeamContributionCalendar';
import * as GetStyledCalendarElement from '../../utils/GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHubUtils from '../../utils/GitHubUtils/GitHubUtils';
import * as GitLabUtils from '../../utils/GitLabUtils/GitLabUtils';
import * as TestUtils from '../../utils/TestUtils/TestUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';
import * as DefaultUsers from '../DefaultUsers/DefaultUsers';

describe('TeamContributionCalendar', () => {
  jsdom({
    url: 'https://example.org/',
  });

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

    beforeEach(() => {
      containerStub = sandbox.stub(GetStyledCalendarElement, 'container');
    });

    describe('when `GetStyledCalendarElement.container` returns an error', () => {
      const containerData = {
        error: true,
        errorMessage: 'Could not find the container element in the DOM.',
      };

      beforeEach(() => {
        containerStub.returns(containerData);
      });

      it('throws the error message', () => {
        expect(() => teamContributionCalendar.renderActualCalendar())
          .to.throw(containerData.errorMessage);
      });
    });

    describe('when `GetStyledCalendarElement.container` does not return any error', () => {
      let appendChildSpy;
      let prependSpy;

      let calendarHeader;
      let calendarTooltip;

      let containerData;

      beforeEach(() => {
        appendChildSpy = sandbox.spy();
        prependSpy = sandbox.spy();

        containerData = {
          selectedElement: {
            prepend: prependSpy,
            appendChild: appendChildSpy,
            innerHTML: null,
          },
          error: false,
          errorMessage: null,
        };

        containerStub.returns(containerData);
        sandbox.stub(GetStyledCalendarElement, 'header').returns(calendarHeader);
        sandbox.stub(GetStyledCalendarElement, 'tooltip').returns(calendarTooltip);
      });

      it('prepends the header to the container', () => {
        teamContributionCalendar.renderActualCalendar();

        expect(containerData.selectedElement.prepend.calledWithExactly(
          calendarHeader,
        )).to.equal(true);
      });

      it('appends the tooltip element to the container', () => {
        teamContributionCalendar.renderActualCalendar();

        expect(containerData.selectedElement.appendChild.calledWithExactly(
          calendarTooltip,
        )).to.equal(true);
      });
    });
  });

  describe('renderBasicAppearance', () => {
    let renderActualCalendarStub;
    let getJsonFormattedCalendarSyncStub;
    let setEmptyCalendarValuesStub;
    let updateCalendarStub;

    beforeEach(() => {
      getJsonFormattedCalendarSyncStub = sandbox.stub(GitHubUtils, 'getJsonFormattedCalendarSync').returns({
        error: false,
      });

      setEmptyCalendarValuesStub = sandbox.stub(GitHubUtils, 'setEmptyCalendarValues');

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

    describe('when `GitHubUtils.getJsonFormattedCalendarSync` returns an error', () => {
      const defaultUserData = {
        error: true,
        errorMessage: 'Could not fetch the calendar of the default user.',
      };

      beforeEach(() => {
        getJsonFormattedCalendarSyncStub.returns(defaultUserData);
      });

      it('calls `updateCalendar` with `isLoading` false', async () => {
        const expectedUpdatedCalendarData = {
          isLoading: false,
        };

        try {
          await teamContributionCalendar.renderBasicAppearance();
        } catch {
          expect(updateCalendarStub.calledWithExactly(
            expectedUpdatedCalendarData,
          )).to.equal(true);
        }
      });

      it('throws the error message', async () => {
        try {
          await teamContributionCalendar.renderBasicAppearance();
        } catch (err) {
          expect(err.message).to.equal(defaultUserData.errorMessage);
        }
      });
    });

    describe('when `GitHubUtils.getJsonFormattedCalendarSync` does not return any error', () => {
      const defaultUserData = {
        parsedCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts({
          '2019-01-20': 12,
        }),
        error: false,
        errorMessage: null,
      };

      const defaultUserEmptyCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
        '2019-01-20': 0,
      });

      beforeEach(() => {
        getJsonFormattedCalendarSyncStub.returns(defaultUserData);
        setEmptyCalendarValuesStub.returns(defaultUserEmptyCalendar);
      });

      it('sets the fetched default GH user`s calendar values to empty ones', async () => {
        await teamContributionCalendar.renderBasicAppearance();

        expect(setEmptyCalendarValuesStub.calledWithExactly(
          defaultUserData.parsedCalendar,
        )).to.equal(true);
      });

      it('calls `updateCalendar` with the empty default user calendar and 0 contributions', async () => {
        const expectedUpdatedCalendarData = {
          contributions: 0,
          updatedActualCalendar: defaultUserEmptyCalendar,
        };

        await teamContributionCalendar.renderBasicAppearance();

        expect(updateCalendarStub.calledWithExactly(
          expectedUpdatedCalendarData,
        )).to.equal(true);
      });
    });
  });

  describe('updateCalendar', () => {
    let renderActualCalendarStub;

    beforeEach(() => {
      renderActualCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'renderActualCalendar');
    });

    describe('when `isLoading` is not defined', () => {
      const dataWithoutIsLoading = {};

      it('does not update `isLoading`', () => {
        const expectedIsLoadingValue = teamContributionCalendar.isLoading;

        teamContributionCalendar.updateCalendar(dataWithoutIsLoading);

        expect(teamContributionCalendar.isLoading).to.equal(expectedIsLoadingValue);
      });
    });

    describe('when `isLoading` is defined', () => {
      const dataWithIsLoading = {
        isLoading: false,
      };

      it('updates `isLoading` to the received value', () => {
        teamContributionCalendar.updateCalendar(dataWithIsLoading);

        expect(teamContributionCalendar.isLoading).to.equal(dataWithIsLoading.isLoading);
      });
    });

    describe('when `updatedActualCalendar` is not defined', () => {
      const data = {};

      it('does not update the actual calendar', () => {
        const expectedActualCalendar = teamContributionCalendar.actualCalendar;

        teamContributionCalendar.updateCalendar(data);

        expect(teamContributionCalendar.actualCalendar).to.equal(expectedActualCalendar);
      });

      it('does not increase the total contributions', () => {
        const expectedTotalContributions = teamContributionCalendar.totalContributions;

        teamContributionCalendar.updateCalendar(data);

        expect(teamContributionCalendar.totalContributions).to.equal(expectedTotalContributions);
      });
    });

    describe('when `updatedActualCalendar` is defined', () => {
      const data = {
        contributions: 1024,
        updatedActualCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts({
          '2018-10-10': 12,
        }),
      };

      it('sets the updated actual calendar', () => {
        teamContributionCalendar.updateCalendar(data);

        expect(teamContributionCalendar.actualCalendar).to.eql(data.updatedActualCalendar);
      });

      it('increases the total contributions by the received value', () => {
        const expectedTotalContributions = teamContributionCalendar.totalContributions
          + data.contributions;

        teamContributionCalendar.updateCalendar(data);

        expect(teamContributionCalendar.totalContributions).to.equal(expectedTotalContributions);
      });
    });

    it('re-renders the calendar', () => {
      teamContributionCalendar.updateCalendar({});

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
    let consoleErrorSpy;

    beforeEach(() => {
      gitHubGetJsonFormattedCalendarAsyncStub = sandbox.stub(GitHubUtils, 'getJsonFormattedCalendarAsync').returns({ error: false });
      gitLabGetJsonFormattedCalendarAsyncStub = sandbox.stub(GitLabUtils, 'getJsonFormattedCalendarAsync').returns({ error: false });

      processGitHubCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'processGitHubCalendar');
      processGitLabCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'processGitLabCalendar');

      consoleErrorSpy = sandbox.stub(console, 'error').returns({});
    });

    describe('GitHub', () => {
      it('fetches the GH user calendars asynchronously', () => {
        const expectedCalledTimes = teamContributionCalendar.users.gitHub.length;

        teamContributionCalendar.aggregateUserCalendars();

        expect(gitHubGetJsonFormattedCalendarAsyncStub.callCount).to.equal(expectedCalledTimes);
      });

      describe('when `GitHubUtils.getJsonFormattedCalendarAsync` returns an error', () => {
        const gitHubUsername = 'wrongGitHubUserName';

        const gitHubUserData = {
          error: true,
          errorMessage: `Could not fetch the calendar of ${gitHubUsername}.`,
        };

        beforeEach(() => {
          teamContributionCalendar.users.gitHubUsers = [gitHubUsername];

          gitHubGetJsonFormattedCalendarAsyncStub.returns(gitHubUserData);
        });

        it('logs the error to the console', () => {
          try {
            teamContributionCalendar.aggregateUserCalendars();
          } catch (err) {
            expect(consoleErrorSpy.calledWithExactly(
              gitHubUserData.errorMessage,
            )).to.equal(true);
          }
        });
      });

      describe('when `GitHubUtils.getJsonFormattedCalendarAsync` does not return any error', () => {
        const gitHubUserData = {
          parsedCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts({
            '2019-03-19': 5,
            '2019-03-20': 5,
          }),
          error: false,
          errorMessage: null,
        };

        beforeEach(() => {
          gitHubGetJsonFormattedCalendarAsyncStub.returns(gitHubUserData);
        });

        it('processes the fetched GH user calendars', async () => {
          await teamContributionCalendar.aggregateUserCalendars();

          expect(processGitHubCalendarStub.calledWithExactly(
            gitHubUserData.parsedCalendar,
          )).to.equal(true);
        });
      });
    });

    describe('GitLab', () => {
      it('fetches the GL user calendars asynchronously', () => {
        const expectedCalledTimes = teamContributionCalendar.users.gitLab.length;

        teamContributionCalendar.aggregateUserCalendars();

        expect(gitLabGetJsonFormattedCalendarAsyncStub.callCount).to.equal(expectedCalledTimes);
      });

      describe('when `GitLabUtils.getJsonFormattedCalendarAsync` returns an error', () => {
        const gitLabUsername = 'wrongGitLabUserName';

        const gitLabUserData = {
          error: true,
          errorMessage: `Could not fetch the calendar of ${gitLabUsername}.`,
        };

        beforeEach(() => {
          teamContributionCalendar.users.gitLab = [gitLabUsername];

          gitLabGetJsonFormattedCalendarAsyncStub.returns(gitLabUserData);
        });

        it('logs the error to the console', async () => {
          await teamContributionCalendar.aggregateUserCalendars();

          expect(consoleErrorSpy.calledWithExactly(
            gitLabUserData.errorMessage,
          )).to.equal(true);
        });
      });

      describe('when `GitLabUtils.getJsonFormattedCalendarAsync` does not return any error', () => {
        const gitLabUserData = {
          parsedCalendar: {
            '2018-02-03': 7,
            '2018-02-09': 3,
          },
          error: false,
          errorMessage: null,
        };

        beforeEach(() => {
          gitLabGetJsonFormattedCalendarAsyncStub.returns(gitLabUserData);
        });

        it('processes the fetched GL user calendars', async () => {
          await teamContributionCalendar.aggregateUserCalendars();

          expect(processGitLabCalendarStub.calledWithExactly(
            gitLabUserData.parsedCalendar,
          )).to.equal(true);
        });
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
