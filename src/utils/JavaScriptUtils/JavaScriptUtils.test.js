import { expect } from "chai";
import * as javaScriptUtils from "./JavaScriptUtils";

describe("JavaScriptUtils", () => {
  describe("isDefined", () => {
    describe("when the given value is `undefined`", () => {
      const value = undefined;

      it("returns false", () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = javaScriptUtils.isDefined(value);

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe("when the given value is `null`", () => {
      const value = null;

      it("returns `false`", () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = javaScriptUtils.isDefined(value);

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe("when the given value is defined", () => {
      const value = 0;

      it("returns true", () => {
        const expectedReturnedValue = true;

        const actualReturnedValue = javaScriptUtils.isDefined(value);

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });
  });

  describe("isSuccess", () => {
    describe("when `statusCode` is OK", () => {
      const statusCode = 200;

      it("returns true", () => {
        const returnedValue = javaScriptUtils.isSuccess(statusCode);

        expect(returnedValue).to.equal(true);
      });
    });

    describe("when `statusCode` is NO_CONTENT", () => {
      const statusCode = 204;

      it("returns true", () => {
        const returnedValue = javaScriptUtils.isSuccess(statusCode);

        expect(returnedValue).to.equal(true);
      });
    });

    describe("when `statusCode` is neither of the codes above", () => {
      const statusCode = 404;

      it("returns false", () => {
        const returnedValue = javaScriptUtils.isSuccess(statusCode);

        expect(returnedValue).to.equal(false);
      });
    });
  });
});
