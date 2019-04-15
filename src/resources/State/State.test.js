import { expect } from 'chai';
import State from './State';
import BasicCalendar from '../BasicCalendar/BasicCalendar.json';
import * as TestUtils from '../../utils/TestUtils/TestUtils';

describe('State', () => {
  let state;

  beforeEach(() => {
    // In order to have a default state in each case.
    state = new State();
  });

  it('sets the actual calendar to `BasicCalendar` by default', () => {
    expect(state.actualCalendar).to.equal(BasicCalendar);
  });

  it('sets the total contributions to 0 by default', () => {
    expect(state.totalContributions).to.equal(0);
  });

  describe('setState', () => {
    const data = {
      currentUserTotalContributions: 2048,
      updatedActualCalendar: TestUtils.getFakeContributionsObjectWithDailyCounts([5])[0],
    };

    it('sets the updated actual calendar to the state', () => {
      state.setState(data);

      expect(state.actualCalendar).to.eql(data.updatedActualCalendar);
    });

    it('adds the received total contributions to the previous value', () => {
      const expectedTotalContributionsValue = state.totalContributions
            + data.currentUserTotalContributions;

      state.setState(data);

      expect(state.totalContributions).to.equal(expectedTotalContributionsValue);
    });
  });
});
