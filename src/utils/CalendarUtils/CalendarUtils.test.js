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
    let handleUserCalendarStub;

    let state;

    const stateFakeParams = TestUtils.getStateFakeParams();

    const userJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([3])[0];

    beforeEach(() => {
      state = new State(
        stateFakeParams.container,
        stateFakeParams.proxyServerUrl,
        stateFakeParams.gitHubUsers,
      );

      getJsonFormattedCalendarAsyncStub = sandbox.stub(GitHub, 'getJsonFormattedCalendarAsync').returns(userJsonCalendar);
      handleUserCalendarStub = sandbox.stub(GitHub, 'handleUserCalendar');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('fetches the JSON formatted calendars asynchronously', async () => {
      const expectedCallCount = stateFakeParams.gitHubUsers.length;

      await CalendarUtils.processStateUsers(state);

      expect(getJsonFormattedCalendarAsyncStub.callCount).to.equal(expectedCallCount);
    });

    it('handles the fetched user JSON calendar', async () => {
      await CalendarUtils.processStateUsers(state);

      expect(handleUserCalendarStub.calledWithExactly(
        state,
        userJsonCalendar,
      )).to.equal(true);
    });
  });
});
