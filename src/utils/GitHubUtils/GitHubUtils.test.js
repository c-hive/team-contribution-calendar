import { expect } from 'chai';
import * as GitHubUtils from './GitHubUtils';
import * as TestUtils from '../TestUtils/TestUtils';

describe('GitHubUtils', () => {
  describe('setEmptyCalendarValues', () => {
    const calendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];

    it('sets the daily contributions to zero', () => {
      const expectedContributionsValue = '0';

      const restoredCalendar = GitHubUtils.setEmptyCalendarValues(calendar);
      const actualContributionsValue = restoredCalendar.children[0].children[0].children[0].attributes['data-count'];

      expect(actualContributionsValue).to.equal(expectedContributionsValue);
    });

    it('sets the fill colors to `#ebedf0`', () => {
      const expectedFillColor = '#ebedf0';

      const restoredCalendar = GitHubUtils.setEmptyCalendarValues(calendar);
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

      const mergedCalendar = GitHubUtils.getMergedCalendars(actualCalendar, userJsonCalendar);
      const actualDataCountValue = mergedCalendar.children[0].children[0].children[0]
        .attributes['data-count'];

      expect(actualDataCountValue).to.equal(expectedDataCountValue);
    });
  });

  describe('getUserTotalContributions', () => {
    const userJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];

    it('returns the total contributions of the given user', () => {
      const expectedTotalContributionsValue = 5;

      const actualTotalContributionsValue = GitHubUtils.getUserTotalContributions(userJsonCalendar);

      expect(actualTotalContributionsValue).to.equal(expectedTotalContributionsValue);
    });
  });
});
