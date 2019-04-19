import { expect } from 'chai';
import * as GitLabUtils from './GitLabUtils';
import * as TestUtils from '../TestUtils/TestUtils';

describe('GitLabUtils', () => {
  describe('mergeCalendarsContributions', () => {
    const actualCalendarFirstDate = '2019-04-18';
    const contributionsOnFirstDate = 5;

    const actualCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts(
      [contributionsOnFirstDate],
      [actualCalendarFirstDate],
    )[0];

    describe('when the user`s JSON calendar contains contributions on `actualCalendarFirstDate`', () => {
      const calendarWithContributionsOnFirstDate = {
        '2019-04-18': 7,
      };

      it('increments the first date`s `data-count` property by the user`s contributions on `actualCalendarFirstDate`', () => {
        const expectedDataCountValue = String(
          contributionsOnFirstDate + calendarWithContributionsOnFirstDate[actualCalendarFirstDate],
        );

        const updatedActualCalendar = GitLabUtils.mergeCalendarsContributions(
          actualCalendar, calendarWithContributionsOnFirstDate,
        );

        const actualDataCountValue = updatedActualCalendar.children[0].children[0].children[0].attributes['data-count'];

        expect(actualDataCountValue).to.equal(expectedDataCountValue);
      });
    });

    describe('when the user`s JSON calendar does not contain contributions on `actualCalendarFirstDate`', () => {
      const calendarWithoutContributionsOnFirstDate = {
        '2019-05-29': 12,
      };

      it('does not increment the first date`s the `data-count` property', () => {
        const expectedDataCountValue = String(contributionsOnFirstDate);

        const updatedActualCalendar = GitLabUtils.mergeCalendarsContributions(
          actualCalendar, calendarWithoutContributionsOnFirstDate,
        );

        const actualDataCountValue = updatedActualCalendar.children[0].children[0].children[0].attributes['data-count'];

        expect(actualDataCountValue).to.equal(expectedDataCountValue);
      });
    });
  });

  describe('getLastYearContributions', () => {
    const userJsonCalendar = {
      '2018-03-18': 3,
      '2018-03-19': 7,
    };

    it('returns the given user last year contributions', () => {
      const expectedLastYearContributions = 10;

      const actualLastYearContributions = GitLabUtils.getLastYearContributions(userJsonCalendar);

      expect(actualLastYearContributions).to.equal(expectedLastYearContributions);
    });
  });
});
