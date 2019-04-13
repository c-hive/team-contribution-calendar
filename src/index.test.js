import { expect } from 'chai';
import sinon from 'sinon';
import TeamContributionCalendar from './index';
import * as Main from './main/main';
import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';
import * as Proxy from './utils/Proxy/Proxy';

describe('TeamContributionCalendar', () => {
  const sandbox = sinon.createSandbox();
  let requiredParamsExistStub;

  beforeEach(() => {
    requiredParamsExistStub = sandbox.stub(CalendarUtils, 'RequiredParamsExist');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when the required params do not exist', () => {
    beforeEach(() => {
      requiredParamsExistStub.callsFake(() => false);
    });

    it('throws an error', () => {
      const expectedErrorMessage = 'Please provide the required parameters in the appropriate format.';

      expect(() => TeamContributionCalendar())
        .to.throw(expectedErrorMessage);
    });
  });

  describe('when the required params exist', () => {
    let processDataStub;

    beforeEach(() => {
      processDataStub = sandbox.stub(Main, 'processData');
      requiredParamsExistStub.callsFake(() => true);
    });

    it('processes the given data', () => {
      const container = 'div';
      const gitHubUsers = ['userName'];

      TeamContributionCalendar(container, gitHubUsers);

      expect(processDataStub
        .calledWith(container, gitHubUsers, [], Proxy.defaultProxyServerUrl)).to.equal(true);
    });
  });
});
