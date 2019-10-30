import { expect } from "chai";
import sinon from "sinon";
import jsdom from "mocha-jsdom";
import TeamContributionCalendar from "./TeamContributionCalendar";
import * as getStyledCalendarElement from "../utils/GetStyledCalendarElement/GetStyledCalendarElement";
import * as gitHubUtils from "../utils/GitHubUtils/GitHubUtils";
import * as gitLabUtils from "../utils/GitLabUtils/GitLabUtils";
import * as calendarUtils from "../utils/CalendarUtils/CalendarUtils";
import * as testUtils from "../utils/TestUtils/TestUtils";
import BasicCalendar from "../resources/BasicCalendar/BasicCalendar.json";
import * as defaultUsers from "../resources/DefaultUsers/DefaultUsers";
import elementIds from "../resources/ElementIds/ElementIds";

describe("TeamContributionCalendar", () => {
  jsdom({
    url: "https://example.org/"
  });

  const sandbox = sinon.createSandbox();
  const testParams = testUtils.getTestParams();

  let teamContributionCalendar;

  beforeEach(() => {
    teamContributionCalendar = new TeamContributionCalendar(
      testParams.container,
      testParams.gitHubUsers,
      testParams.gitLabUsers,
      testParams.proxyServerUrl
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("sets the given container and proxy server url into `configs`", () => {
    const expectedConfig = {
      container: testParams.container,
      proxyServerUrl: testParams.proxyServerUrl
    };

    expect(teamContributionCalendar.configs).to.eql(expectedConfig);
  });

  it("sets the GH and GL users into `users`", () => {
    const expectedUsers = {
      gitHub: [...testParams.gitHubUsers],
      gitLab: [...testParams.gitLabUsers]
    };

    expect(teamContributionCalendar.users).to.eql(expectedUsers);
  });

  it("sets the actual calendar to `BasicCalendar` by default", () => {
    expect(teamContributionCalendar.actualSvg).to.equal(BasicCalendar);
  });

  it("sets the total contributions to 0 by default", () => {
    expect(teamContributionCalendar.totalContributions).to.equal(0);
  });

  it("sets `isLoading` to true by default", () => {
    expect(teamContributionCalendar.isLoading).to.equal(true);
  });

  describe("renderBasicAppearance", () => {
    let renderSvgStub;
    let renderHeaderStub;
    let getJsonFormattedCalendarSyncStub;
    let setEmptyCalendarValuesStub;

    beforeEach(() => {
      getJsonFormattedCalendarSyncStub = sandbox
        .stub(gitHubUtils, "getJsonFormattedCalendarSync")
        .returns({
          error: false
        });

      setEmptyCalendarValuesStub = sandbox.stub(
        gitHubUtils,
        "setEmptyCalendarValues"
      );

      renderSvgStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "renderSvg"
      );

      renderHeaderStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "renderHeader"
      );
    });

    it("renders the calendar's SVG", () => {
      teamContributionCalendar.renderBasicAppearance();

      expect(renderSvgStub.calledOnce).to.equal(true);
    });

    it("renders the calendar's header", () => {
      teamContributionCalendar.renderBasicAppearance();

      expect(renderHeaderStub.calledOnce).to.equal(true);
    });

    it("fetches the default GH user`s calendar synchronously", async () => {
      await teamContributionCalendar.renderBasicAppearance();

      expect(
        getJsonFormattedCalendarSyncStub.calledWithExactly(
          testParams.proxyServerUrl,
          defaultUsers.gitHub
        )
      ).to.equal(true);
    });

    describe("when the fetch fails", () => {
      let updateHeaderStub;

      const defaultUserData = {
        error: true,
        errorMessage: "Could not fetch the calendar of the default user."
      };

      beforeEach(() => {
        updateHeaderStub = sandbox.stub(
          TeamContributionCalendar.prototype,
          "updateHeader"
        );

        getJsonFormattedCalendarSyncStub.returns(defaultUserData);
      });

      it("modifies the header's loading state", () => {
        return teamContributionCalendar.renderBasicAppearance().catch(() => {
          expect(
            updateHeaderStub.calledWithExactly({
              isLoading: false
            })
          ).to.equal(true);
        });
      });

      it("throws the error", () => {
        return teamContributionCalendar.renderBasicAppearance().catch(err => {
          expect(err.message).to.equal(defaultUserData.errorMessage);
        });
      });
    });

    describe("when the fetch does not fail", () => {
      let updateSvgStub;

      const defaultUserData = {
        parsedCalendar: testUtils.getFakeContributionsObjectWithDailyCounts({
          "2019-01-20": 12
        }),
        error: false,
        errorMessage: null
      };

      const defaultUserEmptyCalendar = testUtils.getFakeContributionsObjectWithDailyCounts(
        {
          "2019-01-20": 0
        }
      );

      beforeEach(() => {
        setEmptyCalendarValuesStub.returns(defaultUserEmptyCalendar);

        updateSvgStub = sandbox.stub(
          TeamContributionCalendar.prototype,
          "updateSvg"
        );

        getJsonFormattedCalendarSyncStub.returns(defaultUserData);
      });

      it("empties the default user's calendar data", async () => {
        await teamContributionCalendar.renderBasicAppearance();

        expect(
          setEmptyCalendarValuesStub.calledWithExactly(
            defaultUserData.parsedCalendar
          )
        ).to.equal(true);
      });

      it("updates the calendar's appearance with the emptied calendar", async () => {
        await teamContributionCalendar.renderBasicAppearance();

        expect(
          updateSvgStub.calledWithExactly({
            updatedSvg: defaultUserEmptyCalendar
          })
        ).to.equal(true);
      });
    });
  });

  describe("updateHeader", () => {
    let renderHeaderStub;

    beforeEach(() => {
      renderHeaderStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "renderHeader"
      );
    });

    describe("when `isLoading` is defined", () => {
      const dataWithIsLoading = {
        isLoading: false
      };

      it("updates the loading state to the received value", () => {
        teamContributionCalendar.updateHeader(dataWithIsLoading);

        expect(teamContributionCalendar.isLoading).to.equal(
          dataWithIsLoading.isLoading
        );
      });
    });

    describe("when `isLoading` is not defined", () => {
      it("does not update the loading state", () => {
        const previousLoadingState = teamContributionCalendar.isLoading;

        teamContributionCalendar.updateHeader({});

        expect(teamContributionCalendar.isLoading).to.equal(
          previousLoadingState
        );
      });
    });

    describe("when `contributions` is defined", () => {
      const dataWithContributions = {
        contributions: 100
      };

      it("increments the total contributions with the received value", () => {
        const expectedTotalContributions =
          teamContributionCalendar.totalContributions +
          dataWithContributions.contributions;

        teamContributionCalendar.updateHeader(dataWithContributions);

        expect(teamContributionCalendar.totalContributions).to.equal(
          expectedTotalContributions
        );
      });
    });

    describe("when `contributions` is not defined", () => {
      it("does not increment the total contributions", () => {
        const previousTotalContributions =
          teamContributionCalendar.totalContributions;

        teamContributionCalendar.updateHeader({});

        expect(teamContributionCalendar.totalContributions).to.equal(
          previousTotalContributions
        );
      });
    });

    it("re-renders the header", () => {
      teamContributionCalendar.updateHeader({});

      expect(renderHeaderStub.calledOnce).to.equal(true);
    });
  });

  describe("updateSvg", () => {
    let renderSvgStub;

    beforeEach(() => {
      renderSvgStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "renderSvg"
      );
    });

    describe("when `updatedSvg` is defined", () => {
      const dataWithUpdatedSvg = {
        updatedSvg: testUtils.getFakeContributionsObjectWithDailyCounts({
          "2019-10-28": 5
        })
      };

      it("updates the actual SVG", () => {
        const previousActualSvg = {
          ...teamContributionCalendar.actualSvg
        };

        teamContributionCalendar.updateSvg(dataWithUpdatedSvg);

        expect(teamContributionCalendar.actualSvg).to.eql({
          ...previousActualSvg,
          ...dataWithUpdatedSvg.updatedSvg
        });
      });
    });

    describe("when `updateSvg` is not defined", () => {
      it("does not update the actual SVG", () => {
        const previousActualSvg = {
          ...teamContributionCalendar.actualSvg
        };

        teamContributionCalendar.updateSvg({});

        expect(teamContributionCalendar.actualSvg).to.eql(previousActualSvg);
      });
    });

    it("re-renders the SVG", () => {
      teamContributionCalendar.updateSvg({});

      expect(renderSvgStub.calledOnce).to.equal(true);
    });
  });

  describe("renderHeader", () => {
    let elementExistsStub;

    beforeEach(() => {
      elementExistsStub = sandbox.stub(calendarUtils, "elementExists");
    });

    describe("when the container does not exist", () => {
      beforeEach(() => {
        elementExistsStub
          .withArgs(teamContributionCalendar.configs.container)
          .returns(false);
      });

      it("throws an error", () => {
        expect(() => teamContributionCalendar.renderHeader()).to.throw(
          "The given container does not exist."
        );
      });
    });

    describe("when the container exists", () => {
      let headerStub;
      let containerStub;

      let replaceChildSpy;
      let prependSpy;

      const newHeader = "newHeader";
      const previousHeader = "previousHeader";

      beforeEach(() => {
        elementExistsStub
          .withArgs(teamContributionCalendar.configs.container)
          .returns(true);

        replaceChildSpy = sandbox.spy();
        prependSpy = sandbox.spy();

        headerStub = sandbox
          .stub(getStyledCalendarElement, "header")
          .returns(newHeader);

        containerStub = sandbox
          .stub(getStyledCalendarElement, "container")
          .returns({
            prepend: prependSpy,
            replaceChild: replaceChildSpy
          });

        sandbox.stub(document, "getElementById").returns(previousHeader);
      });

      it("gets the styled calendar container", () => {
        teamContributionCalendar.renderHeader();

        expect(
          containerStub.calledWithExactly(
            teamContributionCalendar.configs.container
          )
        ).to.equal(true);
      });

      it("generates the new header", () => {
        teamContributionCalendar.renderHeader();

        expect(
          headerStub.calledWithExactly(
            teamContributionCalendar.totalContributions,
            teamContributionCalendar.isLoading
          )
        ).to.equal(true);
      });

      describe("when the calendar's header exists", () => {
        beforeEach(() => {
          elementExistsStub.withArgs(`#${elementIds.HEADER}`).returns(true);
        });

        it("replaces the previous header", () => {
          teamContributionCalendar.renderHeader();

          expect(
            replaceChildSpy.calledWithExactly(newHeader, previousHeader)
          ).to.equal(true);
        });
      });

      describe("when the calendar's header does not exist", () => {
        beforeEach(() => {
          elementExistsStub.withArgs(`#${elementIds.HEADER}`).returns(false);
        });

        it("prepends the header to the container", () => {
          teamContributionCalendar.renderHeader();

          expect(prependSpy.calledWithExactly(newHeader)).to.equal(true);
        });
      });
    });
  });

  describe("renderSvg", () => {
    let elementExistsStub;

    beforeEach(() => {
      elementExistsStub = sandbox.stub(calendarUtils, "elementExists");
    });

    describe("when the container does not exist", () => {
      beforeEach(() => {
        elementExistsStub.returns(false);
      });

      it("throws an error", () => {
        expect(() => teamContributionCalendar.renderSvg()).to.throw(
          "The given container does not exist."
        );
      });
    });

    describe("when the container exists", () => {
      let containerStub;
      let svgContainerStub;
      let replaceChildSpy;
      let appendChildSpy;

      beforeEach(() => {
        elementExistsStub
          .withArgs(teamContributionCalendar.configs.container)
          .returns(true);

        replaceChildSpy = sandbox.spy();
        appendChildSpy = sandbox.spy();

        containerStub = sandbox
          .stub(getStyledCalendarElement, "container")
          .returns({
            replaceChild: replaceChildSpy,
            appendChild: appendChildSpy
          });

        svgContainerStub = sandbox
          .stub(getStyledCalendarElement, "svgContainer")
          .returns({
            innerHTML: null
          });
      });

      it("gets the styled calendar container", () => {
        teamContributionCalendar.renderSvg();

        expect(
          containerStub.calledWithExactly(
            teamContributionCalendar.configs.container
          )
        ).to.equal(true);
      });

      it("generates a new SVG container", () => {
        teamContributionCalendar.renderSvg();

        expect(svgContainerStub.calledOnce).to.equal(true);
      });

      describe("when the calendar's SVG container already exists", () => {
        const previousSvgContainer = "previousSvgContainer";

        beforeEach(() => {
          elementExistsStub
            .withArgs(`#${elementIds.SVG_CONTAINER}`)
            .returns(true);

          sandbox
            .stub(document, "getElementById")
            .returns(previousSvgContainer);
        });

        it("replaces the previous container", () => {
          teamContributionCalendar.renderSvg();

          expect(replaceChildSpy.calledOnce).to.equal(true);
        });
      });

      describe("when the calendar's SVG container does not exist", () => {
        beforeEach(() => {
          elementExistsStub
            .withArgs(`#${elementIds.SVG_CONTAINER}`)
            .returns(false);
        });

        it("appends the container and the tooltips to the calendar", () => {
          teamContributionCalendar.renderSvg();

          expect(appendChildSpy.calledTwice).to.equal(true);
        });
      });
    });
  });

  describe("aggregateUserCalendars", () => {
    // All the related functions should be mocked before
    // because they're being called simultaneously within `aggregateUserCalendars`.
    // Otherwise, it'd raise `fetch is not defined` errors.
    // See https://github.com/c-hive/team-contribution-calendar/issues/17.
    let gitHubGetJsonFormattedCalendarAsyncStub;
    let gitLabGetJsonFormattedCalendarAsyncStub;
    let processGitHubCalendarStub;
    let processGitLabCalendarStub;
    let consoleErrorSpy;

    beforeEach(() => {
      gitHubGetJsonFormattedCalendarAsyncStub = sandbox
        .stub(gitHubUtils, "getJsonFormattedCalendarAsync")
        .returns({ error: false });
      gitLabGetJsonFormattedCalendarAsyncStub = sandbox
        .stub(gitLabUtils, "getJsonFormattedCalendarAsync")
        .returns({ error: false });

      processGitHubCalendarStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "processGitHubCalendar"
      );
      processGitLabCalendarStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "processGitLabCalendar"
      );

      consoleErrorSpy = sandbox.stub(console, "error").returns({});
    });

    describe("GitHub", () => {
      it("fetches the GH user calendars asynchronously", () => {
        const expectedCalledTimes =
          teamContributionCalendar.users.gitHub.length;

        teamContributionCalendar.aggregateUserCalendars();

        expect(gitHubGetJsonFormattedCalendarAsyncStub.callCount).to.equal(
          expectedCalledTimes
        );
      });

      describe("when `gitHubUtils.getJsonFormattedCalendarAsync` returns an error", () => {
        const gitHubUsername = "wrongGitHubUserName";

        const gitHubUserData = {
          error: true,
          errorMessage: `Could not fetch the calendar of ${gitHubUsername}.`
        };

        beforeEach(() => {
          teamContributionCalendar.users.gitHubUsers = [gitHubUsername];

          gitHubGetJsonFormattedCalendarAsyncStub.returns(gitHubUserData);
        });

        it("logs the error to the console", async () => {
          await teamContributionCalendar.aggregateUserCalendars();

          expect(
            consoleErrorSpy.calledWithExactly(gitHubUserData.errorMessage)
          ).to.equal(true);
        });
      });

      describe("when `gitHubUtils.getJsonFormattedCalendarAsync` does not return any error", () => {
        const gitHubUserData = {
          parsedCalendar: testUtils.getFakeContributionsObjectWithDailyCounts({
            "2019-03-19": 5,
            "2019-03-20": 5
          }),
          error: false,
          errorMessage: null
        };

        beforeEach(() => {
          gitHubGetJsonFormattedCalendarAsyncStub.returns(gitHubUserData);
        });

        it("processes the fetched GH user calendars", async () => {
          await teamContributionCalendar.aggregateUserCalendars();

          expect(
            processGitHubCalendarStub.calledWithExactly(
              gitHubUserData.parsedCalendar
            )
          ).to.equal(true);
        });
      });
    });

    describe("GitLab", () => {
      it("fetches the GL user calendars asynchronously", () => {
        const expectedCalledTimes =
          teamContributionCalendar.users.gitLab.length;

        teamContributionCalendar.aggregateUserCalendars();

        expect(gitLabGetJsonFormattedCalendarAsyncStub.callCount).to.equal(
          expectedCalledTimes
        );
      });

      describe("when `gitLabUtils.getJsonFormattedCalendarAsync` returns an error", () => {
        const gitLabUsername = "wrongGitLabUserName";

        const gitLabUserData = {
          error: true,
          errorMessage: `Could not fetch the calendar of ${gitLabUsername}.`
        };

        beforeEach(() => {
          teamContributionCalendar.users.gitLab = [gitLabUsername];

          gitLabGetJsonFormattedCalendarAsyncStub.returns(gitLabUserData);
        });

        it("logs the error to the console", async () => {
          await teamContributionCalendar.aggregateUserCalendars();

          expect(
            consoleErrorSpy.calledWithExactly(gitLabUserData.errorMessage)
          ).to.equal(true);
        });
      });

      describe("when `gitLabUtils.getJsonFormattedCalendarAsync` does not return any error", () => {
        const gitLabUserData = {
          parsedCalendar: {
            "2018-02-03": 7,
            "2018-02-09": 3
          },
          error: false,
          errorMessage: null
        };

        beforeEach(() => {
          gitLabGetJsonFormattedCalendarAsyncStub.returns(gitLabUserData);
        });

        it("processes the fetched GL user calendars", async () => {
          await teamContributionCalendar.aggregateUserCalendars();

          expect(
            processGitLabCalendarStub.calledWithExactly(
              gitLabUserData.parsedCalendar
            )
          ).to.equal(true);
        });
      });
    });
  });

  describe("processGitHubCalendar", () => {
    let mergeCalendarsContributionsStub;
    let getLastYearContributionsStub;
    let updateSvgStub;
    let updateHeaderStub;

    const gitHubUserJsonCalendar = testUtils.getFakeContributionsObjectWithDailyCounts(
      {
        "2019-03-10": 15,
        "2019-03-12": 5
      }
    );
    const updatedSvg = testUtils.getFakeContributionsObjectWithDailyCounts({
      "2019-03-10": 18,
      "2019-03-11": 15,
      "2019-03-12": 7
    });
    const lastYearContributions = 1024;

    beforeEach(() => {
      mergeCalendarsContributionsStub = sandbox
        .stub(gitHubUtils, "mergeCalendarsContributions")
        .returns(updatedSvg);
      getLastYearContributionsStub = sandbox
        .stub(gitHubUtils, "getLastYearContributions")
        .returns(lastYearContributions);

      updateSvgStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "updateSvg"
      );
      updateHeaderStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "updateHeader"
      );
    });

    it("merges the actual calendar contributions into the GH user`s contributions", () => {
      teamContributionCalendar.processGitHubCalendar(gitHubUserJsonCalendar);

      expect(
        mergeCalendarsContributionsStub.calledWithExactly(
          teamContributionCalendar.actualSvg,
          gitHubUserJsonCalendar
        )
      ).to.equal(true);
    });

    it("calculates the user`s last year contributions", () => {
      teamContributionCalendar.processGitHubCalendar(gitHubUserJsonCalendar);

      expect(
        getLastYearContributionsStub.calledWithExactly(gitHubUserJsonCalendar)
      ).to.equal(true);
    });

    it("updates the calendar's SVG", () => {
      teamContributionCalendar.processGitHubCalendar(gitHubUserJsonCalendar);

      expect(
        updateSvgStub.calledWithExactly({
          updatedSvg
        })
      ).to.equal(true);
    });

    it("updates the calendar's header", () => {
      teamContributionCalendar.processGitHubCalendar(gitHubUserJsonCalendar);

      expect(
        updateHeaderStub.calledWithExactly({
          contributions: lastYearContributions,
          isLoading: false
        })
      ).to.equal(true);
    });
  });

  describe("processGitLabCalendar", () => {
    let mergeCalendarsContributionsStub;
    let getLastYearContributionsStub;
    let updateSvgStub;
    let updateHeaderStub;

    const gitLabUserJsonCalendar = {
      "2018-02-03": 7,
      "2018-02-09": 3
    };

    const updatedSvg = testUtils.getFakeContributionsObjectWithDailyCounts({
      "2018-02-03": 11,
      "2018-02-09": 20
    });

    const lastYearContributions = 2048;

    beforeEach(() => {
      mergeCalendarsContributionsStub = sandbox
        .stub(gitLabUtils, "mergeCalendarsContributions")
        .returns(updatedSvg);
      getLastYearContributionsStub = sandbox
        .stub(gitLabUtils, "getLastYearContributions")
        .returns(lastYearContributions);

      updateSvgStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "updateSvg"
      );
      updateHeaderStub = sandbox.stub(
        TeamContributionCalendar.prototype,
        "updateHeader"
      );
    });

    it("merges the actual SVG contributions into the GL user`s contributions", () => {
      teamContributionCalendar.processGitLabCalendar(gitLabUserJsonCalendar);

      expect(
        mergeCalendarsContributionsStub.calledWithExactly(
          teamContributionCalendar.actualSvg,
          gitLabUserJsonCalendar
        )
      ).to.equal(true);
    });

    it("calculates the user`s last year contributions", () => {
      teamContributionCalendar.processGitLabCalendar(gitLabUserJsonCalendar);

      expect(
        getLastYearContributionsStub.calledWithExactly(gitLabUserJsonCalendar)
      ).to.equal(true);
    });

    it("updates the calendar's SVG", () => {
      teamContributionCalendar.processGitLabCalendar(gitLabUserJsonCalendar);

      expect(
        updateSvgStub.calledWithExactly({
          updatedSvg
        })
      ).to.equal(true);
    });

    it("updates the calendar's header", () => {
      teamContributionCalendar.processGitLabCalendar(gitLabUserJsonCalendar);

      expect(
        updateHeaderStub.calledWithExactly({
          contributions: lastYearContributions,
          isLoading: false
        })
      ).to.equal(true);
    });
  });
});
