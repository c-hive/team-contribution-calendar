import { expect } from "chai";
import sinon from "sinon";
import * as main from "./Main";
import TeamContributionCalendar from "../TeamContributionCalendar/TeamContributionCalendar";
import * as testUtils from "../utils/TestUtils/TestUtils";

describe("Main", () => {
  const sandbox = sinon.createSandbox();

  describe("processParams", () => {
    let renderBasicAppearanceStub;
    let aggregateUserCalendarsStub;

    const testParams = testUtils.getTestParams();

    beforeEach(() => {
      renderBasicAppearanceStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "renderBasicAppearance"
      );
      aggregateUserCalendarsStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "aggregateUserCalendars"
      );
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("renders the basic appearance", async () => {
      await main.processParams(
        testParams.container,
        testParams.gitHubUsers,
        testParams.gitLabUsers,
        testParams.proxyServerUrl
      );

      expect(renderBasicAppearanceStub.calledOnce).to.equal(true);
    });

    it("aggregates the user calendars", async () => {
      await main.processParams(
        testParams.container,
        testParams.gitHubUsers,
        testParams.gitLabUsers,
        testParams.proxyServerUrl
      );

      expect(aggregateUserCalendarsStub.calledOnce).to.equal(true);
    });
  });
});
