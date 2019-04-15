import { expect } from 'chai';
import sinon from 'sinon';
import TeamContributionCalendar from './index';
import * as Main from './Main/Main';
import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';
import * as Proxy from './utils/Proxy/Proxy';

describe('TeamContributionCalendar', () => {
  const sandbox = sinon.createSandbox();
  let requiredParamsExistStub;

  beforeEach(() => {
    requiredParamsExistStub = sandbox.stub(CalendarUtils, 'requiredParamsExist');
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
    let processParamsStub;

    beforeEach(() => {
      processParamsStub = sandbox.stub(Main, 'processParams');
      requiredParamsExistStub.callsFake(() => true);
    });

    it('processes the given parameters', () => {
      const container = 'div';

      TeamContributionCalendar(container);

      expect(processParamsStub
        .calledWith(container, Proxy.defaultProxyServerUrl)).to.equal(true);
    });
  });
});
