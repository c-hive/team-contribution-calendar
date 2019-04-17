import { expect } from 'chai';
import sinon from 'sinon';
import Index from './index';
import * as Main from './Main/Main';
import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';

describe('Index', () => {
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

      expect(() => Index())
        .to.throw(expectedErrorMessage);
    });
  });

  describe('when the required params exist', () => {
    let processParamsStub;

    const container = '.container';
    const gitHubUsers = ['userName'];
    const proxyServerUrl = 'https://proxy-server.com';

    beforeEach(() => {
      processParamsStub = sandbox.stub(Main, 'processParams');

      requiredParamsExistStub.callsFake(() => true);
    });

    it('processes the given parameters', () => {
      Index(container, gitHubUsers, proxyServerUrl);

      expect(processParamsStub
        .calledWithExactly(container, proxyServerUrl)).to.equal(true);
    });
  });
});
