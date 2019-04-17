import { expect } from 'chai';
import sinon from 'sinon';
import Calendar from './Calendar';
import * as GetStyledCalendarElement from '../../utils/GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHubUtils from '../../utils/GitHubUtils/GitHubUtils';
import * as TestUtils from '../../utils/TestUtils/TestUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';
import * as DefaultUsers from '../DefaultUsers/DefaultUsers';

describe('Calendar', () => {
  const sandbox = sinon.createSandbox();

  let calendar;

  const container = '.container';
  const proxyServerUrl = 'https://proxy-server.com';

  beforeEach(() => {
    calendar = new Calendar(container, proxyServerUrl);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('sets the given container and proxy server url into `configs`', () => {
    const expectedStateConfig = {
      container,
      proxyServerUrl,
    };

    expect(calendar.configs).to.eql(expectedStateConfig);
  });

  it('sets the actual calendar to `BasicCalendar` by default', () => {
    expect(calendar.actualCalendar).to.equal(BasicCalendar);
  });

  it('sets the total contributions to 0 by default', () => {
    expect(calendar.totalContributions).to.equal(0);
  });

  it('sets `isLoading` to true by default', () => {
    expect(calendar.isLoading).to.equal(true);
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
      calendar.renderActualCalendar();

      expect(containerStub.calledWith(calendar.configs.container)).to.equal(true);
    });

    it('renders the calendar header with the total contributions', () => {
      calendar.renderActualCalendar();

      expect(headerStub.calledWith(calendar.totalContributions)).to.equal(true);
    });
  });

  describe('renderBasicAppearance', () => {
    let renderBasicCalendarStub;
    let getJsonFormattedCalendarSyncStub;
    let setEmptyCalendarValuesStub;
    let updateCalendarDetailsStub;

    const defaultUserJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];
    const defaultUserEmptyCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([0])[0];

    beforeEach(() => {
      renderBasicCalendarStub = sandbox.stub(Calendar.prototype, 'renderActualCalendar');
      getJsonFormattedCalendarSyncStub = sandbox.stub(GitHubUtils, 'getJsonFormattedCalendarSync').returns(defaultUserJsonCalendar);
      setEmptyCalendarValuesStub = sandbox.stub(GitHubUtils, 'setEmptyCalendarValues').returns(defaultUserEmptyCalendar);

      updateCalendarDetailsStub = sandbox.stub(Calendar.prototype, 'updateCalendarDetails');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('renders the `BasicCalendar`', () => {
      calendar.renderBasicAppearance();

      expect(renderBasicCalendarStub.calledOnce).to.equal(true);
    });

    it('fetches the default GH user`s calendar synchronously', async () => {
      await calendar.renderBasicAppearance();

      expect(getJsonFormattedCalendarSyncStub.calledWithExactly(
        calendar.configs.proxyServerUrl,
        DefaultUsers.GitHub,
      )).to.equal(true);
    });

    it('sets the fetched default GH user`s calendar values to empty ones', async () => {
      await calendar.renderBasicAppearance();

      expect(setEmptyCalendarValuesStub.calledWithExactly(
        defaultUserJsonCalendar,
      )).to.equal(true);
    });

    it('calls `updateCalendarDetails` with the empty default user calendar and 0 contributions', async () => {
      const expectedCalledCalendarDetails = {
        contributions: 0,
        newActualCalendar: defaultUserEmptyCalendar,
      };

      await calendar.renderBasicAppearance();

      expect(updateCalendarDetailsStub.calledWithExactly(
        expectedCalledCalendarDetails,
      )).to.equal(true);
    });
  });

  describe('updateCalendarDetails', () => {
    let renderActualCalendarStub;

    const data = {
      contributions: 1024,
      newActualCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts([4])[0],
    };

    beforeEach(() => {
      renderActualCalendarStub = sandbox.stub(Calendar.prototype, 'renderActualCalendar');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('sets the new actual calendar', () => {
      calendar.updateCalendarDetails(data);

      expect(calendar.actualCalendar).to.eql(data.newActualCalendar);
    });

    it('adds the received contributions to the current total contributions', () => {
      const expectedTotalContributions = calendar.totalContributions + data.contributions;

      calendar.updateCalendarDetails(data);

      expect(calendar.totalContributions).to.equal(expectedTotalContributions);
    });

    it('re-renders the calendar based on the new values', () => {
      calendar.updateCalendarDetails(data);

      expect(renderActualCalendarStub.calledOnce).to.equal(true);
    });
  });
});
