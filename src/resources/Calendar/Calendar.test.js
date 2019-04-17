/* import { expect } from 'chai';
import sinon from 'sinon';
import State from './State';
import * as Render from '../../utils/CalendarUtils/Render/Render';
import * as TestUtils from '../../utils/TestUtils/TestUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';

describe('State', () => {
  let state;
  let calendarWithContributionsStub;

  const container = '.container';
  const proxyServerUrl = 'https://proxy-server.com';

  beforeEach(() => {
    // In order to have a default state in each case.
    state = new State(container, proxyServerUrl);

    calendarWithContributionsStub = sinon.stub(Render, 'calendarWithContributions');
  });

  afterEach(() => {
    calendarWithContributionsStub.restore();
  });

  it('sets the given container and proxy server url into `configs`', () => {
    const expectedStateConfig = {
      container,
      proxyServerUrl,
    };

    expect(state.configs).to.eql(expectedStateConfig);
  });

  it('sets the actual calendar to `BasicCalendar` by default', () => {
    expect(state.actualCalendar).to.equal(BasicCalendar);
  });

  it('sets the total contributions to 0 by default', () => {
    expect(state.totalContributions).to.equal(0);
  });

  it('sets `isLoading` to true by default', () => {
    expect(state.isLoading).to.equal(true);
  });

  describe('render', () => {
    it('renders the actual calendar details into the given container', () => {
      state.render();

      expect(calendarWithContributionsStub.calledWithExactly(
        state.configs.container,
        state.actualCalendar,
        state.totalContributions,
      )).to.equal(true);
    });
  });

  describe('setStateAndRender', () => {
    const data = {
      currentUserTotalContributions: 2048,
      updatedActualCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0],
    };

    it('sets the updated actual calendar to the state', () => {
      state.setStateAndRender(data);

      expect(state.actualCalendar).to.eql(data.updatedActualCalendar);
    });

    it('adds the received total contributions to the previous value', () => {
      const expectedTotalContributionsValue = state.totalContributions
            + data.currentUserTotalContributions;

      state.setStateAndRender(data);

      expect(state.totalContributions).to.equal(expectedTotalContributionsValue);
    });

    it('renders the actual calendar details', () => {
      const renderSpy = sinon.spy(State.prototype, 'render');

      state.setStateAndRender(data);

      expect(renderSpy.calledOnce).to.equal(true);
    });
  });
}); */
