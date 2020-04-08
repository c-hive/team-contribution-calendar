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
