import { expect } from 'chai';
import * as GitLabUtils from './GitLabUtils';
import * as TestUtils from '../TestUtils/TestUtils';

describe('GitLabUtils', () => {
  describe('mergeCalendarsContributions', () => {
    const actualCalendarFirstDate = '2019-04-18';
    const actualCalendarFirstDateContributions = 5;

    const actualCalendar = TestUtils.getFakeContributionsObjectWithDailyCounts(
      [actualCalendarFirstDateContributions],
      [actualCalendarFirstDate],
    )[0];

    describe('when the user`s JSON calendar contains contributions on `actualCalendarFirstDate`', () => {
      const gitLabUserJsonCalendar = {
        '2019-04-18': 7,
      };

      it('increments the `data-count` property by the user`s contributions on `actualCalendarFirstDate`', () => {
        const expectedDataCountValue = String(
          actualCalendarFirstDateContributions + gitLabUserJsonCalendar[actualCalendarFirstDate],
        );

        const mergedCalendar = GitLabUtils.mergeCalendarsContributions(
          actualCalendar, gitLabUserJsonCalendar,
        );

        const actualDataCountValue = mergedCalendar.children[0].children[0].children[0].attributes['data-count'];

        expect(actualDataCountValue).to.equal(expectedDataCountValue);
      });
    });

    describe('when the user`s JSON calendar does not contain contributions on `actualCalendarFirstDate`', () => {
      const gitLabUserJsonCalendar = {
        '2019-04-19': 12,
      };

      it('does not increment the `data-count` property', () => {
        const expectedDataCountValue = String(actualCalendarFirstDateContributions);

        const mergedCalendar = GitLabUtils.mergeCalendarsContributions(
          actualCalendar, gitLabUserJsonCalendar,
        );

        const actualDataCountValue = mergedCalendar.children[0].children[0].children[0].attributes['data-count'];

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
