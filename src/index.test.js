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
    let consoleErrorSpy;

    beforeEach(() => {
      consoleErrorSpy = sandbox.stub(console, 'error');
      requiredParamsExistStub.callsFake(() => false);
    });

    it('logs the error message to the console', () => {
      TeamContributionCalendar();

      expect(consoleErrorSpy.calledOnce).to.equal(true);
    });
  });

  describe('when the required params exist', () => {
    let consoleLogSpy;

    beforeEach(() => {
      consoleLogSpy = sandbox.stub(console, 'info');
      requiredParamsExistStub.callsFake(() => true);
    });

    it('logs the information message to the console', () => {
      TeamContributionCalendar();

      expect(consoleLogSpy.calledOnce).to.equal(true);
    });
  });
});
