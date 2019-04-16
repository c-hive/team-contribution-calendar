import { expect } from 'chai';
import sinon from 'sinon';
import * as Main from './Main';
import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';

describe('Main', () => {
  describe('processParams', () => {
    let initializeBasicAppearanceStub;

    beforeEach(() => {
      initializeBasicAppearanceStub = sinon.stub(CalendarUtils, 'initializeBasicAppearance');
    });

    afterEach(() => {
      initializeBasicAppearanceStub.restore();
    });

    it('initializes the basic apperance with an empty calendar', () => {
      const container = '.container';
      const proxyServerUrl = 'https://proxy-server.com';

      Main.processParams(container, proxyServerUrl);

      expect(initializeBasicAppearanceStub.calledWith(container, proxyServerUrl)).to.equal(true);
    });
  });
});
