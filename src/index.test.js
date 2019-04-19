import { expect } from 'chai';
import sinon from 'sinon';
import Index from './index';
import * as Main from './Main/Main';
import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';
import * as TestUtils from './utils/TestUtils/TestUtils';

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

    const testParams = TestUtils.getTestParams();

    beforeEach(() => {
      processParamsStub = sandbox.stub(Main, 'processParams');

      requiredParamsExistStub.callsFake(() => true);
    });

    it('processes the given parameters', () => {
      Index(
        testParams.container,
        testParams.gitHubUsers,
        testParams.gitLabUsers,
        testParams.proxyServerUrl,
      );

      expect(processParamsStub.calledWithExactly(
        testParams.container,
        testParams.gitHubUsers,
        testParams.proxyServerUrl,
      )).to.equal(true);
    });
  });
});
