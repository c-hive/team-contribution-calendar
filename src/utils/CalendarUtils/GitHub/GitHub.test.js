import { expect } from 'chai';
import sinon from 'sinon';
import * as GitHub from './GitHub';
import * as TestUtils from '../../TestUtils/TestUtils';
import State from '../../../resources/State/State';

describe('GitHub', () => {
  describe('restoreCalendarValues', () => {
    const calendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];

    it('restores the daily contributions to zero', () => {
      const expectedContributionsValue = '0';

      const restoredCalendar = GitHub.restoreCalendarValues(calendar);
      const actualContributionsValue = restoredCalendar.children[0].children[0].children[0].attributes['data-count'];

      expect(actualContributionsValue).to.equal(expectedContributionsValue);
    });

    it('restores the fill colors to `#ebedf0`', () => {
      const expectedFillColor = '#ebedf0';

      const restoredCalendar = GitHub.restoreCalendarValues(calendar);
      const actualFillColor = restoredCalendar.children[0].children[0].children[0].attributes.fill;

      expect(actualFillColor).to.equal(expectedFillColor);
    });
  });

  describe('handleUserCalendar', () => {
    let state;

    const stateFakeParams = TestUtils.getStateFakeParams();

    const actualStateCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([4])[0];

    let setStateAndRenderStub;

    beforeEach(() => {
      state = new State(
        stateFakeParams.container,
        stateFakeParams.proxyServerUrl,
        stateFakeParams.gitHubUsers,
      );

      state.actualCalendar = actualStateCalendar;

      setStateAndRenderStub = sinon.stub(State.prototype, 'setStateAndRender');
    });

    afterEach(() => {
      setStateAndRenderStub.restore();
    });
  });

  /* describe('mergeCalendars', () => {
    const actualCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];
    const userJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([6])[0];

    it('sets the `data-count` property based on the given calendars', () => {
      // Because of the previously created 5 and 6 contribution calendars.
      const expectedDataCountValue = '11';

      const mergedCalendar = GitHub.mergeCalendars(actualCalendar, userJsonCalendar);
      const actualDataCountValue = mergedCalendar.children[0].children[0].children[0]
        .attributes['data-count'];

      expect(actualDataCountValue).to.equal(expectedDataCountValue);
    });
  }); */
});
