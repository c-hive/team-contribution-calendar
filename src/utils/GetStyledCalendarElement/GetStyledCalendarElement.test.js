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
    it('returns a `div` element', () => {
      const calendarHeader = GetStyledCalendarElement.header();

      expect(calendarHeader.nodeName).to.equal('DIV');
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
});
