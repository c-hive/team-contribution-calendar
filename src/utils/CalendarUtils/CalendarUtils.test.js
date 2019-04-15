import { expect } from 'chai';
import sinon from 'sinon';
import * as CalendarUtils from './CalendarUtils';
import * as Render from './Render/Render';
import * as GitHub from './GitHub/GitHub';
import * as TestUtils from '../TestUtils/TestUtils';
import * as DefaultUsers from '../../resources/DefaultUsers/DefaultUsers';
import BasicCalendar from '../../resources/BasicCalendar/BasicCalendar.json';

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

  describe('initializeBasicAppearance', () => {
    const sandbox = sinon.createSandbox();

    let calendarWithContributionsStub;
    let getJsonFormattedCalendarSyncStub;
    let restoreCalendarValuesStub;

    const container = '.container';
    const proxyServerUrl = 'https://proxy-server.com';
    const defaultUserJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];
    const restoredDefaultUserCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([0])[0];

    beforeEach(() => {
      calendarWithContributionsStub = sandbox.stub(Render, 'calendarWithContributions');
      getJsonFormattedCalendarSyncStub = sandbox.stub(GitHub, 'getJsonFormattedCalendarSync').returns(defaultUserJsonCalendar);
      restoreCalendarValuesStub = sandbox.stub(GitHub, 'restoreCalendarValues').returns(restoredDefaultUserCalendar);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('renders `BasicCalendar` with 0 total contributions', async () => {
      await CalendarUtils.initializeBasicAppearance(container, proxyServerUrl);

      expect(calendarWithContributionsStub.calledWith(container, BasicCalendar, 0)).to.equal(true);
    });

    it('fetches the default user`s calendar synchronously', async () => {
      await CalendarUtils.initializeBasicAppearance(container, proxyServerUrl);

      expect(getJsonFormattedCalendarSyncStub.calledWith(proxyServerUrl, DefaultUsers.GitHub))
        .to.equal(true);
    });

    it('restores the user`s values to the default ones', async () => {
      await CalendarUtils.initializeBasicAppearance(container, proxyServerUrl);

      expect(restoreCalendarValuesStub.calledWith(defaultUserJsonCalendar)).to.equal(true);
    });

    it('renders the restored user calendar with 0 total contributions', async () => {
      await CalendarUtils.initializeBasicAppearance(container, proxyServerUrl);

      expect(calendarWithContributionsStub.calledWith(container, restoredDefaultUserCalendar, 0))
        .to.equal(true);
    });
  });
});
