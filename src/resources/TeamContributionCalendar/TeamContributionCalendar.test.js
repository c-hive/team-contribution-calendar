import { expect } from 'chai';
import sinon from 'sinon';
import TeamContributionCalendar from './TeamContributionCalendar';
import * as GetStyledCalendarElement from '../../utils/GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHubUtils from '../../utils/GitHubUtils/GitHubUtils';
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
      testParams.proxyServerUrl,
      testParams.gitHubUsers,
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

  it('sets the GH users into `users`', () => {
    const expectedUsers = {
      gitHub: [...testParams.gitHubUsers],
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

    beforeEach(() => {
      appendChildSpy = sandbox.spy();
      prependSpy = sandbox.spy();

      containerStub = sandbox.stub(GetStyledCalendarElement, 'container').returns({
        prepend: prependSpy,
      });

      headerStub = sandbox.stub(GetStyledCalendarElement, 'header').returns({
        appendChild: appendChildSpy,
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('renders a container based on the passed param', () => {
      teamContributionCalendar.renderActualCalendar();

      expect(containerStub.calledWithExactly(
        teamContributionCalendar.configs.container,
      )).to.equal(true);
    });

    it('renders the calendar header with the total contributions', () => {
      teamContributionCalendar.renderActualCalendar();

      expect(headerStub.calledWithExactly(
        teamContributionCalendar.totalContributions,
      )).to.equal(true);
    });
  });

  describe('renderBasicAppearance', () => {
    let renderActualCalendarStub;
    let getJsonFormattedCalendarSyncStub;
    let setEmptyCalendarValuesStub;
    let updateCalendarStub;

    const defaultUserJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];
    const defaultUserEmptyCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([0])[0];

    beforeEach(() => {
      getJsonFormattedCalendarSyncStub = sandbox.stub(GitHubUtils, 'getJsonFormattedCalendarSync').returns(defaultUserJsonCalendar);
      setEmptyCalendarValuesStub = sandbox.stub(GitHubUtils, 'setEmptyCalendarValues').returns(defaultUserEmptyCalendar);

      renderActualCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'renderActualCalendar');
      updateCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'updateCalendar');
    });

    afterEach(() => {
      sandbox.restore();
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
        newActualCalendar: defaultUserEmptyCalendar,
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
      newActualCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts([4])[0],
    };

    beforeEach(() => {
      renderActualCalendarStub = sandbox.stub(TeamContributionCalendar.prototype, 'renderActualCalendar');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('sets the new actual calendar', () => {
      teamContributionCalendar.updateCalendar(data);

      expect(teamContributionCalendar.actualCalendar).to.eql(data.newActualCalendar);
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
});
