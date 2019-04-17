import { expect } from 'chai';
import sinon from 'sinon';
import * as Main from './Main';
import TeamContributionCalendar from '../resources/TeamContributionCalendar/TeamContributionCalendar';

describe('Main', () => {
  describe('processParams', () => {
    let renderBasicAppearanceStub;

    const container = '.container';
    const proxyServerUrl = 'https://proxy-server.com';

    beforeEach(() => {
      renderBasicAppearanceStub = sinon.stub(TeamContributionCalendar.prototype, 'renderBasicAppearance');
    });

    afterEach(() => {
      renderBasicAppearanceStub.restore();
    });

    it('renders the basic appearance', async () => {
      await Main.processParams(container, proxyServerUrl);

      expect(renderBasicAppearanceStub.calledOnce).to.equal(true);
    });
  });
});
