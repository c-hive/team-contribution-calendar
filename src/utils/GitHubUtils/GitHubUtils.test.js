import { expect } from 'chai';
import * as GitHubUtils from './GitHubUtils';
import * as TestUtils from '../TestUtils/TestUtils';

describe('GitHubUtils', () => {
  describe('setEmptyCalendarValues', () => {
    const calendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2019-03-21': 5,
    });

    it('sets the daily contributions to zero', () => {
      const expectedContributionsValue = 0;

      const restoredCalendar = GitHubUtils.setEmptyCalendarValues(calendar);
      const actualContributionsValue = Number(restoredCalendar.children[0].children[0].children[0].attributes['data-count']);

      expect(actualContributionsValue).to.equal(expectedContributionsValue);
    });

    it('sets the fill colors to `#ebedf0`', () => {
      const expectedFillColor = '#ebedf0';

      const restoredCalendar = GitHubUtils.setEmptyCalendarValues(calendar);
      const actualFillColor = restoredCalendar.children[0].children[0].children[0].attributes.fill;

      expect(actualFillColor).to.equal(expectedFillColor);
    });
  });

  describe('mergeCalendarsContributions', () => {
    const actualCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2019-04-19': 5,
    });
    const userJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2019-04-19': 6,
    });

    it('merges the `data-count` properties of the given calendars', () => {
      // Because of the previously created 5 and 6 contribution calendars.
      const expectedDataCountValue = 11;

      const mergedCalendar = GitHubUtils.mergeCalendarsContributions(
        actualCalendar, userJsonCalendar,
      );

      const actualDataCountValue = Number(mergedCalendar.children[0].children[0].children[0]
        .attributes['data-count']);

      expect(actualDataCountValue).to.equal(expectedDataCountValue);
    });
  });

  describe('getLastYearContributions', () => {
    const userJsonCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts({
      '2019-01-20': 5,
      '2019-01-25': 12,
      '2019-01-26': 15,
    });

    it('returns the given user last year contributions', () => {
      const expectedLastYearContributions = 32;

      const actualLastYearContributions = GitHubUtils.getLastYearContributions(userJsonCalendar);

      expect(actualLastYearContributions).to.equal(expectedLastYearContributions);
    });
  });
});
