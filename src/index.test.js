import { expect } from "chai";
import sinon from "sinon";
import index from "./index";
import * as main from "./Main/Main";
import { getTestParams } from "./utils/TestUtils/TestUtils";
import defaultProxyServerUrl from "./resources/DefaultProxyServerUrl/DefaultProxyServerUrl";

describe("index", () => {
  let processParamsStub;

  beforeEach(() => {
    processParamsStub = sinon.stub(main, "processParams");
  });

  afterEach(() => {
    processParamsStub.restore();
  });

  it("processes the provided arguments", () => {
    const testParams = Object.values(getTestParams());

    index(...testParams);

    expect(processParamsStub.calledWithExactly(...testParams)).to.equal(true);
  });

  describe("when the CORS proxy server URL is not provided", () => {
    it("defaults to the default CORS proxy server", () => {
      const expectedArgs = [".container", [], [], defaultProxyServerUrl];

      index(".container", [], undefined);

      expect(processParamsStub.calledWithExactly(...expectedArgs)).to.equal(
        true
      );
    });
  });

  describe("when the GitHub users array is not provided", () => {
    it("defaults to an empty array", () => {
      const expectedArgs = [".container", [], [], defaultProxyServerUrl];

      index(".container", undefined, []);

      expect(processParamsStub.calledWithExactly(...expectedArgs)).to.equal(
        true
      );
    });
  });

  describe("when the GitLab users array is not provided", () => {
    it("defaults to an empty array", () => {
      const expectedArgs = [".container", [], [], defaultProxyServerUrl];

      index(".container", []);

      expect(processParamsStub.calledWithExactly(...expectedArgs)).to.equal(
        true
      );
    });
  });

  // Heads-up: optional parameters do not default to the provided value unless it's in fact `undefined`.
  describe("when the GitHub users array is not defined", () => {
    it("throws an error to fail-early", () => {
      const args = [".container", null, []];

      expect(() => index(...args)).to.throw(
        "GitHub users must be an array if provided. Omit or pass undefined to bypass this contraint."
      );
    });
  });

  // Heads-up: optional parameters do not default to the provided value unless it's in fact `undefined`.
  describe("when the GitLab users array is not defined", () => {
    it("throws an error to fail-early", () => {
      const args = [".container", [], null];

      expect(() => index(...args)).to.throw(
        "GitLab users must be an array if provided. Omit or pass undefined to bypass this contraint."
      );
    });
  });
});
