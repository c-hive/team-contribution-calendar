import { expect } from 'chai';
import sinon from 'sinon';
import * as CalendarUtils from './CalendarUtils';
import * as GitHub from './GitHub/GitHub';
import * as TestUtils from '../TestUtils/TestUtils';
import State from '../../resources/State/State';

describe('CalendarUtils', () => {
  describe('requiredParamsExist', () => {
    describe('when container is not defined', () => {
      it('returns false', () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = CalendarUtils.requiredParamsExist();

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe('when GH users are not defined', () => {
      it('returns false', () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = CalendarUtils.requiredParamsExist('div');

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe('when the parameters are defined', () => {
      it('returns true', () => {
        const expectedReturnedValue = true;

        const actualReturnedValue = CalendarUtils.requiredParamsExist('div', []);

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });
  });

  describe('processStateUsers', () => {
    const sandbox = sinon.createSandbox();

    let getJsonFormattedCalendarAsyncStub;
    let getMergedCalendarsStub;
    let getUserTotalContributionsStub;
    let setStateAndRenderStub;

    let state;

    const stateFakeParams = TestUtils.getStateFakeParams();

    const userJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([3])[0];
    const mergedCalendars = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];
    const userTotalContributions = 512;

    beforeEach(() => {
      state = new State(
        stateFakeParams.container,
        stateFakeParams.proxyServerUrl,
        stateFakeParams.gitHubUsers,
      );

      getJsonFormattedCalendarAsyncStub = sandbox.stub(GitHub, 'getJsonFormattedCalendarAsync').returns(userJsonCalendar);
      getMergedCalendarsStub = sandbox.stub(GitHub, 'getMergedCalendars').returns(mergedCalendars);
      getUserTotalContributionsStub = sandbox.stub(GitHub, 'getUserTotalContributions').returns(userTotalContributions);
      setStateAndRenderStub = sandbox.stub(State.prototype, 'setStateAndRender');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('fetches GH users JSON calendars asynchronously', async () => {
      const expectedCalledTimes = state.users.gitHubUsers.length;

      await CalendarUtils.processStateUsers(state);

      expect(getJsonFormattedCalendarAsyncStub.callCount).to.equal(expectedCalledTimes);
    });

    it('merges the current user JSON calendar into the actual calendar', async () => {
      await CalendarUtils.processStateUsers(state);

      expect(getMergedCalendarsStub.calledWithExactly(
        state.actualCalendar,
        userJsonCalendar,
      )).to.equal(true);
    });

    it('calculates the total contributions', async () => {
      await CalendarUtils.processStateUsers(state);

      expect(getUserTotalContributionsStub.calledWithExactly(userJsonCalendar)).to.equal(true);
    });

    it('sets the updated details into the state', async () => {
      const expectedCalledState = {
        updatedActualCalendar: mergedCalendars,
        userTotalContributions,
        isLoading: false,
      };

      await CalendarUtils.processStateUsers(state);

      expect(setStateAndRenderStub.calledWithExactly(expectedCalledState)).to.equal(true);
    });
  });
});
