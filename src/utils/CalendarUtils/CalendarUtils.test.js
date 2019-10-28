import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";
import * as calendarUtils from "./CalendarUtils";
import * as TestUtils from "../TestUtils/TestUtils";

describe("CalendarUtils", () => {
  describe("requiredParamsExist", () => {
    describe("when `container` is not defined", () => {
      it("returns false", () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = calendarUtils.requiredParamsExist();

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe("when the GH and GL user arrays are empty", () => {
      it("returns false", () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = calendarUtils.requiredParamsExist(
          "div",
          [],
          []
        );

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe("when the `container` is defined", () => {
      describe("when one GH user is presented and the GL users array is empty", () => {
        it("returns true", () => {
          const expectedReturnedValue = true;

          const actualReturnedValue = calendarUtils.requiredParamsExist("div", [
            "gitHubUsername"
          ]);

          expect(actualReturnedValue).to.equal(expectedReturnedValue);
        });
      });

      describe("when one GL user is presented and the GH users array is empty", () => {
        it("returns true", () => {
          const expectedReturnedValue = true;

          const actualReturnedValue = calendarUtils.requiredParamsExist(
            "div",
            [],
            ["gitLabUsername"]
          );

          expect(actualReturnedValue).to.equal(expectedReturnedValue);
        });
      });

      describe("when both arrays are filled with users", () => {
        it("returns true", () => {
          const expectedReturnedValue = true;

          const actualReturnedValue = calendarUtils.requiredParamsExist(
            "div",
            ["gitHubUsername"],
            ["gitLabUsername"]
          );

          expect(actualReturnedValue).to.equal(expectedReturnedValue);
        });
      });
    });
  });

  describe("getFillColor", () => {
    describe("when the total of the daily contributions is 0", () => {
      const totalDailyContributions = 0;

      it("returns the default color", () => {
        const expectedFillColor = "#ebedf0";

        const actualFillColor = calendarUtils.getFillColor(
          totalDailyContributions
        );

        expect(actualFillColor).to.equal(expectedFillColor);
      });
    });

    describe("when the total of the daily contributions is higher than 0 and less than 10", () => {
      const totalDailyContributions = 9;

      it("returns the `#c6e48b` color", () => {
        const expectedFillColor = "#c6e48b";

        const actualFillColor = calendarUtils.getFillColor(
          totalDailyContributions
        );

        expect(actualFillColor).to.equal(expectedFillColor);
      });
    });

    describe("when the total of the daily contributions is higher than or equal to 10 and less than 20", () => {
      const totalDailyContributions = 19;

      it("returns the `#7bc96f` color", () => {
        const expectedFillColor = "#7bc96f";

        const actualFillColor = calendarUtils.getFillColor(
          totalDailyContributions
        );

        expect(actualFillColor).to.equal(expectedFillColor);
      });
    });

    describe("when the total of the daily contributions is higher than or equal to 20 and less than 30", () => {
      const totalDailyContributions = 29;

      it("returns the `#239a3b` color", () => {
        const expectedFillColor = "#239a3b";

        const actualFillColor = calendarUtils.getFillColor(
          totalDailyContributions
        );

        expect(actualFillColor).to.equal(expectedFillColor);
      });
    });

    describe("when the total of the daily contributions is higher than or equal to 30", () => {
      const totalDailyContributions = 30;

      it("returns the `#196127` color", () => {
        const expectedFillColor = "#196127";

        const actualFillColor = calendarUtils.getFillColor(
          totalDailyContributions
        );

        expect(actualFillColor).to.equal(expectedFillColor);
      });
    });
  });

  describe("getCalendarDataByIndexes", () => {
    const calendarData = TestUtils.getFakeContributionsObjectWithDailyCounts({
      "2019-04-20": 15
    });
    const weekIndex = 0;

    describe("when the day index is defined", () => {
      const dayIndex = 0;

      it("returns the daily data", () => {
        const expectedDailyData =
          calendarData.children[0].children[weekIndex].children[dayIndex];

        const actualDailyData = calendarUtils.getCalendarDataByIndexes(
          calendarData,
          weekIndex,
          dayIndex
        );

        expect(actualDailyData).to.equal(expectedDailyData);
      });
    });

    describe("when the day index is not defined", () => {
      it("returns the weekly data", () => {
        const expectedWeeklyData = calendarData.children[0].children[weekIndex];

        const actualWeeklyData = calendarUtils.getCalendarDataByIndexes(
          calendarData,
          weekIndex
        );

        expect(actualWeeklyData).to.equal(expectedWeeklyData);
      });
    });
  });

  describe("containerExists", () => {
    let ellyStub;
    let calendarUtilsWithMockedElly;

    const selector = ".container";

    beforeEach(() => {
      ellyStub = sinon.stub().withArgs(selector);

      calendarUtilsWithMockedElly = proxyquire("./CalendarUtils.js", {
        elly: ellyStub
      });
    });

    afterEach(() => {
      ellyStub.restore();
    });

    describe("when the given element exists", () => {
      beforeEach(() => {
        ellyStub.returns({});
      });

      it("returns true", () => {
        expect(calendarUtilsWithMockedElly.containerExists(selector)).to.equal(
          true
        );
      });
    });

    describe("when the given element does not exist", () => {
      beforeEach(() => {
        ellyStub.returns(null);
      });

      it("returns false", () => {
        expect(calendarUtilsWithMockedElly.containerExists(selector)).to.equal(
          false
        );
      });
    });
  });
});
