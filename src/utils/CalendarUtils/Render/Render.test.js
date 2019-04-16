import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import jsdom from 'mocha-jsdom';
import * as GetStyledCalendarElement from '../../GetStyledCalendarElement/GetStyledCalendarElement';

const svgsonStub = {};

const Render = proxyquire('./Render.js', {
  svgson: svgsonStub,
});

describe('Render', () => {
  // https://github.com/rstacruz/mocha-jsdom/issues/36
  // https://github.com/jsdom/jsdom/issues/2383
  jsdom({
    url: 'https://example.org/',
  });

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  svgsonStub.stringify = () => ({
    innerHTML: null,
  });

  describe('calendarWithContributions', () => {
    const container = '.container';

    let containerStub;
    let headerStub;

    let appendChildSpy;
    let prependSpy;

    beforeEach(() => {
      appendChildSpy = sandbox.spy();
      prependSpy = sandbox.spy();

      containerStub = sandbox.stub(GetStyledCalendarElement, 'container').returns({
        prepend: prependSpy,
      });

      headerStub = sandbox.stub(GetStyledCalendarElement, 'header').returns({
        appendChild: appendChildSpy,
      });
    });

    it('renders a container based on the passed param', () => {
      Render.calendarWithContributions(container);

      expect(containerStub.calledWith(container)).to.equal(true);
    });

    it('renders the calendar header with the total contributions', () => {
      const totalContributions = 1024;

      Render.calendarWithContributions(container, null, totalContributions);

      expect(headerStub.calledWith(totalContributions)).to.equal(true);
    });
  });
});
