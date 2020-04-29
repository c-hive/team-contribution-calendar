import { expect } from "chai";
import * as gitHubUtils from "./GitHubUtils";
import * as testUtils from "../TestUtils/TestUtils";

describe("GitHubUtils", () => {
  describe("initialize", () => {
    const calendar = testUtils.getFakeContributionsObjectWithDailyCounts({
      "2019-03-21": 5
    });

    it("sets the daily contributions to zero", () => {
      const expectedContributionsValue = 0;

      const restoredCalendar = gitHubUtils.initialize(calendar);
      const actualContributionsValue = Number(
        restoredCalendar.children[0].children[0].children[0].attributes[
          "data-count"
        ]
      );

      expect(actualContributionsValue).to.equal(expectedContributionsValue);
    });

    it("sets the fill colors to `#ebedf0`", () => {
      const expectedFillColor = "#ebedf0";

      const restoredCalendar = gitHubUtils.initialize(calendar);
      const actualFillColor =
        restoredCalendar.children[0].children[0].children[0].attributes.fill;

      expect(actualFillColor).to.equal(expectedFillColor);
    });

    it("sets the text colors to `#767676`", () => {
      const expectedFillColor = "#767676";

      const restoredCalendar = gitHubUtils.initialize(
        testUtils.getInitialCalendarWithTextFill()
      );
      const actualFillColor =
        restoredCalendar.children[0].children[0].attributes.fill;

      expect(actualFillColor).to.equal(expectedFillColor);
    });
  });

  describe("dailyDataWithContributionsTransformation", () => {
    const calendar = testUtils.getFakeContributionsObjectWithDailyCounts({
      "2020-04-11": 5
    });

    it("transforms the 'bloated' JSON to 'date-contributions' pairs of an object", () => {
      expect(
        gitHubUtils.dailyDataWithContributionsTransformation(calendar)
      ).to.eql({
        "2020-04-11": 5
      });
    });
  });
});
