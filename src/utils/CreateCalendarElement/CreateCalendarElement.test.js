import { expect } from 'chai';
import jsdom from 'mocha-jsdom';
import proxyquire from 'proxyquire';

const CreateCalendarElement = proxyquire('./CreateCalendarElement.js', {
  elly: () => ({
    style: {},
  }),
});

describe('CreateCalendarElement', () => {
  // https://github.com/rstacruz/mocha-jsdom/issues/36
  // https://github.com/jsdom/jsdom/issues/2383
  jsdom({
    url: 'https://example.org/',
  });

  describe('container', () => {
    it('returns a 700px width element', () => {
      const calendarContainer = CreateCalendarElement.container('.class');

      expect(calendarContainer.style.width).to.equal('700px');
    });
  });

  describe('header', () => {
    it('returns a `div` element', () => {
      const calendarHeader = CreateCalendarElement.header();

      expect(calendarHeader.nodeName).to.equal('DIV');
    });

    it('appends two child nodes to the header', () => {
      const calendarHeader = CreateCalendarElement.header();

      expect(calendarHeader.childNodes.length).to.equal(2);
    });
  });
});
