import { expect } from 'chai';
import sum from './index';

describe('sum', () => {
  it('adds up the given numbers', () => {
    const expectedSumValue = 10;

    const actualSumValue = sum(5, 5);

    expect(actualSumValue).to.equal(expectedSumValue);
  });
});
