import { expect } from 'chai';
import sinon from 'sinon';
import * as Main from './Main';
import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import State from '../resources/State/State';

describe('Main', () => {
  describe('processParams', () => {
    let initializeBasicAppearanceStub;

    beforeEach(() => {
      initializeBasicAppearanceStub = sinon.stub(CalendarUtils, 'initializeBasicAppearance');
    });

    afterEach(() => {
      initializeBasicAppearanceStub.restore();
    });

    it('initializes the basic apperance with a default state', () => {
      const state = new State();
      const container = '.container';
      const proxyServerUrl = 'https://proxy-server.com';

      Main.processParams(container, proxyServerUrl);

      expect(initializeBasicAppearanceStub.calledWithExactly(state, container, proxyServerUrl))
        .to.equal(true);
    });
  });
});
