import { expect } from 'chai';
import jsdom from 'mocha-jsdom';
import proxyquire from 'proxyquire';

const GetStyledCalendarElement = proxyquire('./GetStyledCalendarElement.js', {
  elly: () => ({
    style: {},
  }),
});

describe('GetStyledCalendarElement', () => {
  // https://github.com/rstacruz/mocha-jsdom/issues/36
  // https://github.com/jsdom/jsdom/issues/2383
  jsdom({
    url: 'https://example.org/',
  });

  describe('container', () => {
    it('returns a 700px width element', () => {
      const calendarContainer = GetStyledCalendarElement.container('.class');

      expect(calendarContainer.style.width).to.equal('700px');
    });
  });

  describe('header', () => {
    const totalContributions = 1024;

    it('returns a `div` element', () => {
      const calendarHeader = GetStyledCalendarElement.header(totalContributions);

      expect(calendarHeader.nodeName).to.equal('DIV');
    });

    describe('when `isLoading` is true', () => {
      const isLoading = true;

      it('does not render the total contributions text', () => {
        const calendarHeader = GetStyledCalendarElement.header(totalContributions, isLoading);

        expect(calendarHeader.childNodes[0].innerText).to.be.an('undefined');
      });
    });

    describe('when `isLoading` is false', () => {
      const isLoading = false;

      it('renders the total contributions text', () => {
        const expectedTotalContributionsText = `${totalContributions} contributions in the last year`;

        const calendarHeader = GetStyledCalendarElement.header(totalContributions, isLoading);

        expect(calendarHeader.childNodes[0].innerText).to.equal(expectedTotalContributionsText);
      });
    });

    it('appends a paragraph to the header', () => {
      const calendarHeader = GetStyledCalendarElement.header();

      expect(calendarHeader.childNodes[0].nodeName).to.equal('P');
    });

    it('appends the colors list to the header', () => {
      const calendarHeader = GetStyledCalendarElement.header();

      expect(calendarHeader.childNodes[1].nodeName).to.equal('UL');
    });
  });

  describe('tooltip', () => {
    it('sets the `id` attribute to `tooltip`', () => {
      const calendarTooltip = GetStyledCalendarElement.tooltip();

      expect(calendarTooltip.id).to.equal('tooltip');
    });

    it('returns a `div` element', () => {
      const calendarTooltip = GetStyledCalendarElement.tooltip();

      expect(calendarTooltip.nodeName).to.equal('DIV');
    });
  });
});
