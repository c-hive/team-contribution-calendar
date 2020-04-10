import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";
import * as calendarUtils from "./CalendarUtils";
import * as TestUtils from "../TestUtils/TestUtils";

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

  describe("filterContributionDays", () => {
    describe("when the passed daily data is either a month's or weekday's name", () => {
      const dailyData = {
        attributes: {
          class: "month"
        }
      };

      it("returns false", () => {
        expect(calendarUtils.filterContributionDays(dailyData)).to.equal(false);
      });
    });

    describe("when the passed daily data is in fact a day", () => {
      describe("when the starting end ending points of the timeframe are not specified", () => {
        const dailyData = {
          attributes: {
            class: "day"
          }
        };
        const timeframe = {};

        it("returns true", () => {
          expect(
            calendarUtils.filterContributionDays(dailyData, timeframe)
          ).to.equal(true);
        });
      });

      describe("when the starting point of the timeframe is specified but the end date is missing", () => {
        describe("when the contribution's date is earlier than the starting point", () => {
          const dailyData = {
            attributes: {
              class: "day",
              "data-date": "2019-09-01"
            }
          };
          const timeframe = {
            start: "2019-09-02"
          };

          it("returns false", () => {
            expect(
              calendarUtils.filterContributionDays(dailyData, timeframe)
            ).to.equal(false);
          });
        });

        describe("when the contribution's date is not earlier than the starting point", () => {
          const dailyData = {
            attributes: {
              class: "day",
              "data-date": "2019-09-02"
            }
          };
          const timeframe = {
            start: "2019-09-01"
          };

          it("returns true", () => {
            expect(
              calendarUtils.filterContributionDays(dailyData, timeframe)
            ).to.equal(true);
          });
        });
      });

      describe("when the end date of the timeframe is specified but the start date is missing", () => {
        describe("when the contribution's date is not earlier than the end date", () => {
          const dailyData = {
            attributes: {
              class: "day",
              "data-date": "2019-09-03"
            }
          };
          const timeframe = {
            end: "2019-09-02"
          };

          it("returns false", () => {
            expect(
              calendarUtils.filterContributionDays(dailyData, timeframe)
            ).to.equal(false);
          });
        });

        describe("when the contribution's date is earlier than the end date", () => {
          const dailyData = {
            attributes: {
              class: "day",
              "data-date": "2019-09-02"
            }
          };
          const timeframe = {
            end: "2019-09-03"
          };

          it("returns true", () => {
            expect(
              calendarUtils.filterContributionDays(dailyData, timeframe)
            ).to.equal(true);
          });
        });
      });

      describe("when the start and end dates of the timeframe are specified", () => {
        describe("when the contribution's date falls into the timeframe", () => {
          const dailyData = {
            attributes: {
              class: "day",
              "data-date": "2019-09-02"
            }
          };
          const timeframe = {
            start: "2019-09-01",
            end: "2019-09-03"
          };

          it("returns true", () => {
            expect(
              calendarUtils.filterContributionDays(dailyData, timeframe)
            ).to.equal(true);
          });
        });

        describe("when the contribution's date does not fall into the timeframe", () => {
          const dailyData = {
            attributes: {
              class: "day",
              "data-date": "2019-09-04"
            }
          };
          const timeframe = {
            start: "2019-09-01",
            end: "2019-09-03"
          };

          it("returns false", () => {
            expect(
              calendarUtils.filterContributionDays(dailyData, timeframe)
            ).to.equal(false);
          });
        });
      });
    });
  });
});
