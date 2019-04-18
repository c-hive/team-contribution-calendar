import { expect } from 'chai';
import * as GitLabUtils from './GitLabUtils';

describe('GitLabUtils', () => {
  describe('getLastYearContributions', () => {
    const userJsonCalendar = {
      '2018-02-03': 7,
      '2018-02-09': 3,
    };

    it('returns the given user last year contributions', () => {
      const expectedLastYearContributions = 10;

      const actualLastYearContributions = GitLabUtils.getLastYearContributions(userJsonCalendar);

      expect(actualLastYearContributions).to.equal(expectedLastYearContributions);
    });
  });
});
