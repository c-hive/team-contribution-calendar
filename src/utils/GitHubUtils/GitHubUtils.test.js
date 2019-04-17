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
});
