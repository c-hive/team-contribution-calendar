import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import jsdom from 'mocha-jsdom';
import * as GetStyledCalendarElement from '../../GetStyledCalendarElement/GetStyledCalendarElement';
import * as GitHub from '../GitHub/GitHub';
import * as TestUtils from '../../TestUtils/TestUtils';
import State from '../../../resources/State/State';
import * as DefaultUsers from '../../../resources/DefaultUsers/DefaultUsers';

const svgsonStub = {};

const Render = proxyquire('./Render.js', {
  svgson: svgsonStub,
});

describe('Render', () => {
  // https://github.com/rstacruz/mocha-jsdom/issues/36
  // https://github.com/jsdom/jsdom/issues/2383
  jsdom({
    url: 'https://example.org/',
  });

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  svgsonStub.stringify = () => ({
    innerHTML: null,
  });

  describe('calendarWithContributions', () => {
    const container = '.container';

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

    it('renders a container based on the passed param', () => {
      Render.calendarWithContributions(container);

      expect(containerStub.calledWithExactly(container)).to.equal(true);
    });

    it('renders the calendar header with the total contributions', () => {
      const totalContributions = 1024;

      Render.calendarWithContributions(container, null, totalContributions);

      expect(headerStub.calledWithExactly(totalContributions)).to.equal(true);
    });
  });

  describe('defaultUserCalendar', () => {
    let getJsonFormattedCalendarSyncStub;
    let restoreCalendarValuesStub;
    let setStateAndRenderStub;

    let state;

    const defaultUserJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];
    const restoredDefaultUserCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([0])[0];

    beforeEach(() => {
      state = new State();

      getJsonFormattedCalendarSyncStub = sandbox.stub(GitHub, 'getJsonFormattedCalendarSync').returns(defaultUserJsonCalendar);
      restoreCalendarValuesStub = sandbox.stub(GitHub, 'restoreCalendarValues').returns(restoredDefaultUserCalendar);
      setStateAndRenderStub = sandbox.stub(State.prototype, 'setStateAndRender');
    });

    it('fetches the default GH user`s calendar synchronously', async () => {
      await Render.defaultUserCalendar(state);

      expect(getJsonFormattedCalendarSyncStub.calledWithExactly(
        state.configs.proxyServerUrl,
        DefaultUsers.GitHub,
      )).to.equal(true);
    });

    it('restores the default user`s calendar values', async () => {
      await Render.defaultUserCalendar(state);

      expect(restoreCalendarValuesStub.calledWithExactly(
        defaultUserJsonCalendar,
      )).to.equal(true);
    });

    it('sets the restored user calendar to the state and increments the total contributions by 0', async () => {
      await Render.defaultUserCalendar(state);

      const expectedCalledData = {
        currentUserTotalContributions: 0,
        updatedActualCalendar: restoredDefaultUserCalendar,
      };

      expect(setStateAndRenderStub.calledWith(expectedCalledData)).to.equal(true);
    });
  });
});
