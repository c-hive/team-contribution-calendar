import * as main from "./Main/Main";
import defaultProxyServerUrl from "./resources/DefaultProxyServerUrl/DefaultProxyServerUrl";
import { isDefined } from "./utils/JavaScriptUtils/JavaScriptUtils";

export default (
  container,
  gitHubUsers,
  gitLabUsers,
  proxyServerUrl = defaultProxyServerUrl
) => {
  if (!isDefined(container)) {
    throw new Error("Arguments are not sufficently provided.");
  }

  if (!isDefined(gitHubUsers) || !Array.isArray(gitHubUsers)) {
    throw new Error("Arguments are not sufficently provided.");
  }

  if (!isDefined(gitLabUsers) || !Array.isArray(gitLabUsers)) {
    throw new Error("Arguments are not sufficently provided.");
  }

  return main.processParams(
    container,
    gitHubUsers,
    gitLabUsers,
    proxyServerUrl
  );
};
