import { expect } from 'chai';
import * as GitHub from './GitHub';
import * as TestUtils from '../../TestUtils/TestUtils';

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

  describe('getMergedCalendars', () => {
    const actualCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];
    const userJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([6])[0];

    it('sets the `data-count` property based on the given calendars', () => {
      // Because of the previously created 5 and 6 contribution calendars.
      const expectedDataCountValue = '11';

      const mergedCalendar = GitHub.getMergedCalendars(actualCalendar, userJsonCalendar);
      const actualDataCountValue = mergedCalendar.children[0].children[0].children[0]
        .attributes['data-count'];

      expect(actualDataCountValue).to.equal(expectedDataCountValue);
    });
  });
});
