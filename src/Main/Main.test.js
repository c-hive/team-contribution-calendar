import { expect } from 'chai';
import sinon from 'sinon';
import jsdom from 'mocha-jsdom';
import * as Main from './Main';
import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import * as TestUtils from '../utils/TestUtils/TestUtils';
import State from '../resources/State/State';

describe('Main', () => {
  const sandbox = sinon.createSandbox();

  jsdom({
    url: 'https://example.org/',
  });

  describe('processParams', () => {
    let renderDefaultUserCalendarStub;
    let stateRenderStub;
    let processStateUsersStub;

    const stateFakeParams = TestUtils.getStateFakeParams();

    beforeEach(() => {
      stateRenderStub = sandbox.stub(State.prototype, 'render');
      renderDefaultUserCalendarStub = sandbox.stub(CalendarUtils.Render, 'defaultUserCalendar');
      processStateUsersStub = sandbox.stub(CalendarUtils, 'processStateUsers');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('renders `BasicCalendar` by calling `state.render`', async () => {
      await Main.processParams(
        stateFakeParams.container,
        stateFakeParams.proxyServerUrl,
        stateFakeParams.gitHubUsers,
      );

      expect(stateRenderStub.calledOnce).to.equal(true);
    });

    it('renders the default user calendar', async () => {
      await Main.processParams(
        stateFakeParams.container,
        stateFakeParams.proxyServerUrl,
        stateFakeParams.gitHubUsers,
      );

      expect(renderDefaultUserCalendarStub.calledOnce).to.equal(true);
    });

    it('processes the stored users in the state', async () => {
      await Main.processParams(
        stateFakeParams.container,
        stateFakeParams.proxyServerUrl,
        stateFakeParams.gitHubUsers,
      );

      expect(processStateUsersStub.calledOnce).to.equal(true);
    });
  });
});
