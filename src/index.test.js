import { expect } from "chai";
import sinon from "sinon";
import index from "./index";
import * as main from "./Main/Main";
import defaultProxyServerUrl from "./resources/DefaultProxyServerUrl/DefaultProxyServerUrl";

describe("index", () => {
  it("processes the parameters", () => {
    const mainStub = sinon.stub(main, "processParams");
    const args = [".container", [], []];

    index(...args);

    // Since the proxy server's url isn't specified, `index()` is expected to be invoked with the default server.
    expect(mainStub.calledWithExactly(...args, defaultProxyServerUrl)).to.equal(
      true
    );
  });

  describe("when the `container` does not exist", () => {
    it("throws an error to fail-early", () => {
      expect(() => index(null, [], [])).to.throw(
        "Arguments are not sufficently provided."
      );
    });
  });

  describe("when `gitHubUsers` is not defined", () => {
    it("throws an error to fail-early", () => {
      expect(() => index(".container", null, [])).to.throw(
        "Arguments are not sufficently provided."
      );
    });
  });

  describe("when `gitHubUsers` is not an array", () => {
    it("throws an error to fail-early", () => {
      // The `isDefined()` function treats empty strings as defined values.
      expect(() => index(".container", "", [])).to.throw(
        "Arguments are not sufficently provided."
      );
    });
  });

  describe("when `gitLabUsers` is not defined", () => {
    it("throws an error to fail-early", () => {
      expect(() => index(".container", [], null)).to.throw(
        "Arguments are not sufficently provided."
      );
    });
  });

  describe("when `gitLabUsers` is not an array", () => {
    it("throws an error to fail-early", () => {
      // The `isDefined()` function treats empty strings as defined values.
      expect(() => index(".container", [], "")).to.throw(
        "Arguments are not sufficently provided."
      );
    });
  });
});

/* describe("Index", () => {
  const sandbox = sinon.createSandbox();

  let requiredParamsExistStub;

  beforeEach(() => {
    requiredParamsExistStub = sandbox.stub(
      calendarUtils,
      "requiredParamsExist"
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("when the required params do not exist", () => {
    beforeEach(() => {
      requiredParamsExistStub.callsFake(() => false);
    });

    it("throws an error", () => {
      const expectedErrorMessage =
        "Please provide the required parameters in the appropriate format.";

      expect(() => Index()).to.throw(expectedErrorMessage);
    });
  });

  describe("when the required params exist", () => {
    let processParamsStub;

    const testParams = testUtils.getTestParams();

    beforeEach(() => {
      processParamsStub = sandbox.stub(main, "processParams");

      requiredParamsExistStub.callsFake(() => true);
    });

    it("processes the given parameters", () => {
      Index(
        testParams.container,
        testParams.gitHubUsers,
        testParams.gitLabUsers,
        testParams.proxyServerUrl
      );

      expect(
        processParamsStub.calledWithExactly(
          testParams.container,
          testParams.gitHubUsers,
          testParams.gitLabUsers,
          testParams.proxyServerUrl
        )
      ).to.equal(true);
    });
  });
}); */
