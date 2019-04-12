import { expect } from 'chai';
import * as CalendarUtils from './CalendarUtils';

describe('CalendarUtils', () => {
  describe('RequiredParamsExist', () => {
    describe('when container is not defined', () => {
      it('returns false', () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = CalendarUtils.RequiredParamsExist();

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe('when GH users are not defined', () => {
      it('returns false', () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = CalendarUtils.RequiredParamsExist('div');

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe('when `gitHubUsers` is not an array', () => {
      it('returns false', () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = CalendarUtils.RequiredParamsExist('div', 'users');

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe('when the parameters are in the appropriate format', () => {
      it('returns true', () => {
        const expectedReturnedValue = true;

        const actualReturnedValue = CalendarUtils.RequiredParamsExist('div', []);

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });
  });
});
