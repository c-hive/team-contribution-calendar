import { expect } from 'chai';
import * as GitHub from './GitHub';
import * as TestUtils from '../../TestUtils/TestUtils';

describe('GitHub', () => {
  describe('restoreCalendarValues', () => {
    const calendar = TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0];

    it('restores the contributions to zero', () => {
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
});
