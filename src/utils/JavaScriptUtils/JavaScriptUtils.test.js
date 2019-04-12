import { expect } from 'chai';
import * as JavaScriptUtils from './JavaScriptUtils';

describe('JavaScriptUtils', () => {
  describe('isDefined', () => {
    describe('when the given value is undefined', () => {
      const value = undefined;

      it('returns false', () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = JavaScriptUtils.isDefined(value);

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe('when the given value is defined', () => {
      const value = 0;

      it('returns true', () => {
        const expectedReturnedValue = true;

        const actualReturnedValue = JavaScriptUtils.isDefined(value);

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });
  });
});
