import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";
import * as calendarUtils from "./CalendarUtils";
import * as testUtils from "../TestUtils/TestUtils";

describe("CalendarUtils", () => {
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
    const calendarData = testUtils.getFakeContributionsObjectWithDailyCounts({
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

  describe("elementExists", () => {
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
      ellyStub.reset();
    });

    describe("when the given element exists", () => {
      beforeEach(() => {
        ellyStub.returns({});
      });

      it("returns true", () => {
        expect(calendarUtilsWithMockedElly.elementExists(selector)).to.equal(
          true
        );
      });
    });

    describe("when the given element does not exist", () => {
      beforeEach(() => {
        ellyStub.returns(null);
      });

      it("returns false", () => {
        expect(calendarUtilsWithMockedElly.elementExists(selector)).to.equal(
          false
        );
      });
    });
  });

  describe("filterByTimeframe", () => {
    const dailyDataWithContributions = {
      "2019-10-10": 11,
      "2019-12-31": 5,
      "2020-01-01": 6
    };

    describe("when the starting end ending points of the timeframe are not specified", () => {
      it("returns the calendar as-is", () => {
        expect(
          calendarUtils.filterByTimeframe(dailyDataWithContributions, {})
        ).to.equal(dailyDataWithContributions);
      });
    });

    describe("when the starting point of the timeframe is specified", () => {
      it("removes the entries preceding the specified starting date", () => {
        const timeframe = { start: "2019-12-31" };

        expect(
          calendarUtils.filterByTimeframe(dailyDataWithContributions, timeframe)
        ).to.eql({
          "2019-12-31": 5,
          "2020-01-01": 6
        });
      });
    });

    describe("when the ending point of the timeframe is specified", () => {
      it("removes the entries later than the specified ending date", () => {
        const timeframe = { end: "2019-12-31" };

        expect(
          calendarUtils.filterByTimeframe(dailyDataWithContributions, timeframe)
        ).to.eql({
          "2019-10-10": 11,
          "2019-12-31": 5
        });
      });
    });

    describe("when both the starting and ending point of the timeframe are specified", () => {
      it("removes the entries falling out of the specified range", () => {
        const timeframe = { start: "2019-10-10", end: "2019-12-30" };

        expect(
          calendarUtils.filterByTimeframe(dailyDataWithContributions, timeframe)
        ).to.eql({
          "2019-10-10": 11
        });
      });
    });
  });

  describe("aggregateContributions", () => {
    it("aggregates the contributions", () => {
      const dailyDataWithContributions = {
        "2019-10-10": 11,
        "2019-12-31": 5,
        "2020-01-01": 6
      };

      expect(
        calendarUtils.aggregateContributions(dailyDataWithContributions)
      ).to.equal(22);
    });
  });
});
