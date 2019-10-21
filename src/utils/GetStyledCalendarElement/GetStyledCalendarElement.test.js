import { expect } from "chai";
import jsdom from "mocha-jsdom";
import proxyquire from "proxyquire";
import elementIds from "../../resources/ElementIds/ElementIds";

const getStyledCalendarElement = proxyquire("./GetStyledCalendarElement.js", {
  elly: () => ({
    style: {}
  })
});

describe("GetStyledCalendarElement", () => {
  // https://github.com/rstacruz/mocha-jsdom/issues/36
  // https://github.com/jsdom/jsdom/issues/2383
  jsdom({
    url: "https://example.org/"
  });

  describe("header", () => {
    const totalContributions = 1024;

    it("returns a `div` element", () => {
      const calendarHeader = getStyledCalendarElement.header(
        totalContributions
      );

      expect(calendarHeader.nodeName).to.equal("DIV");
    });

    describe("when `isLoading` is true", () => {
      const isLoading = true;

      it("does not render the total contributions text", () => {
        const calendarHeader = getStyledCalendarElement.header(
          totalContributions,
          isLoading
        );

        expect(calendarHeader.childNodes[0].innerText).to.be.an("undefined");
      });

      it("sets the height of <p /> to 15px", () => {
        const calendarHeader = getStyledCalendarElement.header(
          totalContributions,
          isLoading
        );

        expect(calendarHeader.childNodes[0].style.height).to.equal("15px");
      });
    });

    describe("when `isLoading` is false", () => {
      const isLoading = false;

      it("renders the total contributions text", () => {
        const expectedTotalContributionsText = `${totalContributions} contributions in the last year`;

        const calendarHeader = getStyledCalendarElement.header(
          totalContributions,
          isLoading
        );

        expect(calendarHeader.childNodes[0].innerText).to.equal(
          expectedTotalContributionsText
        );
      });
    });

    it("appends a paragraph to the header", () => {
      const calendarHeader = getStyledCalendarElement.header();

      expect(calendarHeader.childNodes[0].nodeName).to.equal("P");
    });

    it("appends the colors list to the header", () => {
      const calendarHeader = getStyledCalendarElement.header();

      expect(calendarHeader.childNodes[1].nodeName).to.equal("UL");
    });
  });

  describe("tooltip", () => {
    it("sets the `id` attribute to `elementIds.TOOLTIP`", () => {
      const calendarTooltip = getStyledCalendarElement.tooltip();

      expect(calendarTooltip.id).to.equal(elementIds.TOOLTIP);
    });

    it("returns a `div` element", () => {
      const calendarTooltip = getStyledCalendarElement.tooltip();

      expect(calendarTooltip.nodeName).to.equal("DIV");
    });
  });

  describe("contributionsWithDateText", () => {
    const date = "2019-01-23";

    it("returns a `span` element", () => {
      const tooltipInnerText = getStyledCalendarElement.contributionsWithDateText(
        50,
        date
      );

      expect(tooltipInnerText.nodeName).to.equal("SPAN");
    });

    it("appends a `span` to the tooltip element", () => {
      const tooltipInnerText = getStyledCalendarElement.contributionsWithDateText(
        50,
        date
      );

      expect(tooltipInnerText.childNodes[0].nodeName).to.equal("SPAN");
    });

    it("sets the appended span`s text to the given date", () => {
      const expectedDateText = ` on ${date}`;

      const tooltipInnerText = getStyledCalendarElement.contributionsWithDateText(
        50,
        date
      );

      expect(tooltipInnerText.childNodes[0].innerText).to.equal(
        expectedDateText
      );
    });

    describe("when the `contributions` is 0", () => {
      const contributions = 0;

      it("renders `No contributions`", () => {
        const expectedContributionsText = "No contributions";

        const tooltipInnerText = getStyledCalendarElement.contributionsWithDateText(
          contributions,
          date
        );

        expect(tooltipInnerText.innerText).to.equal(expectedContributionsText);
      });
    });

    describe("when the `contributions` is higher than 0", () => {
      const contributions = 1;

      it("renders the given `contributions`", () => {
        const expectedContributionsText = `${contributions} contributions`;

        const tooltipText = getStyledCalendarElement.contributionsWithDateText(
          contributions,
          date
        );

        expect(tooltipText.innerText).to.equal(expectedContributionsText);
      });
    });
  });
});
