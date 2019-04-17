import { expect } from 'chai';
import sinon from 'sinon';
import * as Main from './Main';
import TeamContributionCalendar from '../resources/TeamContributionCalendar/TeamContributionCalendar';
import * as TestUtils from '../utils/TestUtils/TestUtils';

describe('Main', () => {
  describe('processParams', () => {
    let renderBasicAppearanceStub;

    const testParams = TestUtils.getTestParams();

    beforeEach(() => {
      renderBasicAppearanceStub = sinon.stub(TeamContributionCalendar.prototype, 'renderBasicAppearance');
    });

    afterEach(() => {
      renderBasicAppearanceStub.restore();
    });

    it('renders the basic appearance', async () => {
      await Main.processParams(
        testParams.container, testParams.proxyServerUrl, testParams.gitHubUsers,
      );

      expect(renderBasicAppearanceStub.calledOnce).to.equal(true);
    });
  });
});
