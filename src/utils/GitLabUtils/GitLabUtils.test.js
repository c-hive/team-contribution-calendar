import { expect } from "chai";
import * as gitLabUtils from "./GitLabUtils";
import * as testUtils from "../TestUtils/TestUtils";

describe("GitLabUtils", () => {
  describe("mergeCalendarsContributions", () => {
    const actualCalendar = testUtils.getFakeContributionsObjectWithDailyCounts({
      "2019-04-20": 10
    });

    describe("when the user`s calendar contains contributions on the date that is presented in the actual calendar", () => {
      const gitLabUserJsonCalendar = {
        "2019-04-20": 22
      };

      it("increments the `data-count` property by the user contributions on that date", () => {
        const expectedContributions = 32;

        const updatedActualCalendar = gitLabUtils.mergeCalendarsContributions(
          actualCalendar,
          gitLabUserJsonCalendar
        );
        const actualContributions = Number(
          updatedActualCalendar.children[0].children[0].children[0].attributes[
            "data-count"
          ]
        );

        expect(actualContributions).to.equal(expectedContributions);
      });
    });

    describe("when the user`s calendar does not contain contributions on the date that is presented in the actual calendar", () => {
      const gitLabUserJsonCalendar = {
        "2019-01-25": 5
      };

      it("increments the actual calendar`s `data-count` property by 0", () => {
        const expectedContributions = 10;

        const updatedActualCalendar = gitLabUtils.mergeCalendarsContributions(
          actualCalendar,
          gitLabUserJsonCalendar
        );
        const actualContributions = Number(
          updatedActualCalendar.children[0].children[0].children[0].attributes[
            "data-count"
          ]
        );

        expect(actualContributions).to.equal(expectedContributions);
      });
    });
  });

  describe("getLastYearContributions", () => {
    const userJsonCalendar = {
      "2018-03-18": 3,
      "2018-03-19": 7
    };

    it("returns the given user last year contributions", () => {
      const expectedLastYearContributions = 10;

      const actualLastYearContributions = gitLabUtils.getLastYearContributions(
        userJsonCalendar
      );

      expect(actualLastYearContributions).to.equal(
        expectedLastYearContributions
      );
    });
  });
});
