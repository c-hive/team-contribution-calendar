import { expect } from 'chai';
import sinon from 'sinon';
import TeamContributionCalendar from './index';
import * as CalendarUtils from './utils/CalendarUtils/CalendarUtils';

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
    let consoleInfoSpy;

    beforeEach(() => {
      consoleInfoSpy = sandbox.stub(console, 'info');
      requiredParamsExistStub.callsFake(() => true);
    });

    it('logs the information message to the console', () => {
      TeamContributionCalendar();

      expect(consoleInfoSpy.calledOnce).to.equal(true);
    });
  });
});
