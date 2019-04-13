import { expect } from 'chai';
import sinon from 'sinon';
import jsdom from 'mocha-jsdom';
import proxyquire from 'proxyquire';
import * as GetStyledCalendarElement from '../GetStyledCalendarElement/GetStyledCalendarElement';

const svgsonStub = {};

const CalendarUtils = proxyquire('./CalendarUtils.js', {
  svgson: svgsonStub,
});

describe('CalendarUtils', () => {
  describe('RequiredParamsExist', () => {
    describe('when container is not defined', () => {
      it('returns false', () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = CalendarUtils.RequiredParamsExist();

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe('when GH users are not defined', () => {
      it('returns false', () => {
        const expectedReturnedValue = false;

        const actualReturnedValue = CalendarUtils.RequiredParamsExist('div');

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });

    describe('when the parameters are defined', () => {
      it('returns true', () => {
        const expectedReturnedValue = true;

        const actualReturnedValue = CalendarUtils.RequiredParamsExist('div', []);

        expect(actualReturnedValue).to.equal(expectedReturnedValue);
      });
    });
  });

  describe('RenderCalendarWithContributions', () => {
    // https://github.com/rstacruz/mocha-jsdom/issues/36
    // https://github.com/jsdom/jsdom/issues/2383
    jsdom({
      url: 'https://example.org/',
    });

    const sandbox = sinon.createSandbox();

    svgsonStub.stringify = () => ({
      innerHTML: null,
    });

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

    afterEach(() => {
      sandbox.restore();
    });

    it('renders a container based on the passed param', () => {
      CalendarUtils.RenderCalendarWithContributions(container);

      expect(containerStub.calledWith(container)).to.equal(true);
    });

    it('renders the calendar header with the total contributions', () => {
      const totalContributions = 1024;

      CalendarUtils.RenderCalendarWithContributions(container, null, totalContributions);

      expect(headerStub.calledWith(totalContributions)).to.equal(true);
    });
  });
});
