import { expect } from 'chai';
import sinon from 'sinon';
import jsdom from 'mocha-jsdom';
import * as Main from './Main';
import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import State from '../resources/State/State';

describe('Main', () => {
  const sandbox = sinon.createSandbox();

  jsdom({
    url: 'https://example.org/',
  });

  describe('processParams', () => {
    let renderDefaultUserCalendarStub;
    let stateRenderStub;

    const container = '.container';
    const proxyServerUrl = 'https://proxy-server.com';

    beforeEach(() => {
      stateRenderStub = sandbox.stub(State.prototype, 'render');
      renderDefaultUserCalendarStub = sandbox.stub(CalendarUtils.Render, 'defaultUserCalendar');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('renders `BasicCalendar` by calling `state.render`', () => {
      Main.processParams(container, proxyServerUrl);

      expect(stateRenderStub.calledOnce).to.equal(true);
    });

    it('renders the default user calendar', () => {
      Main.processParams(container, proxyServerUrl);

      expect(renderDefaultUserCalendarStub.calledOnce).to.equal(true);
    });
  });
});
