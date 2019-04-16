import { expect } from 'chai';
import sinon from 'sinon';
import State from './State';
import * as Render from '../../utils/CalendarUtils/Render/Render';
import * as TestUtils from '../../utils/TestUtils/TestUtils';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';

describe('State', () => {
  let state;
  let calendarWithContributionsStub;

  const stateFakeParams = TestUtils.getStateFakeParams();

  beforeEach(() => {
    // In order to have a default state in each case.
    state = new State(
      stateFakeParams.container,
      stateFakeParams.proxyServerUrl,
      stateFakeParams.gitHubUsers,
    );

    calendarWithContributionsStub = sinon.stub(Render, 'calendarWithContributions');
  });

  afterEach(() => {
    calendarWithContributionsStub.restore();
  });

  it('sets the given container and proxy server url into `configs`', () => {
    const expectedStateConfig = {
      container: stateFakeParams.container,
      proxyServerUrl: stateFakeParams.proxyServerUrl,
    };

    expect(state.configs).to.eql(expectedStateConfig);
  });

  it('sets the actual calendar to `BasicCalendar` by default', () => {
    expect(state.actualCalendar).to.eql(BasicCalendar);
  });

  it('sets the total contributions to 0 by default', () => {
    expect(state.totalContributions).to.equal(0);
  });

  it('sets `isLoading` to true by default', () => {
    expect(state.isLoading).to.equal(true);
  });

  describe('render', () => {
    it('renders the actual calendar details into the given container', () => {
      const expectedCalendarDetails = {
        container: state.configs.container,
        actualCalendar: state.actualCalendar,
        totalContributions: state.totalContributions,
        isLoading: state.isLoading,
      };

      state.render();

      expect(calendarWithContributionsStub.calledWithExactly(expectedCalendarDetails)).to.eql(true);
    });
  });

  describe('setStateAndRender', () => {
    const data = {
      userTotalContributions: 2048,
      updatedActualCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0],
    };

    describe('when `isLoading` is not defined', () => {
      const dataWithoutIsLoading = {
        ...data,
      };

      it('does not update the `isLoading` state value', () => {
        const previousIsLoadingState = state.isLoading;

        state.setStateAndRender(dataWithoutIsLoading);

        expect(state.isLoading).to.equal(previousIsLoadingState);
      });
    });

    describe('when `isLoading` is defined', () => {
      const dataWithIsLoading = {
        ...data,
        isLoading: false,
      };

      it('updates `isLoading` to the received value', () => {
        state.setStateAndRender(dataWithIsLoading);

        expect(state.isLoading).to.equal(dataWithIsLoading.isLoading);
      });
    });

    it('sets the updated actual calendar to the state', () => {
      state.setStateAndRender(data);

      expect(state.actualCalendar).to.eql(data.updatedActualCalendar);
    });

    it('adds the received user total contributions to the previous value', () => {
      const expectedTotalContributionsValue = state.totalContributions
            + data.userTotalContributions;

      state.setStateAndRender(data);

      expect(state.totalContributions).to.equal(expectedTotalContributionsValue);
    });

    it('renders the actual calendar details', () => {
      const renderSpy = sinon.spy(State.prototype, 'render');

      state.setStateAndRender(data);

      expect(renderSpy.calledOnce).to.equal(true);
    });
  });
});
