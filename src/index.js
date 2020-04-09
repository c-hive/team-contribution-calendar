import * as main from "./Main/Main";
import defaultProxyServerUrl from "./resources/DefaultProxyServerUrl/DefaultProxyServerUrl";
import { isDefined } from "./utils/JavaScriptUtils/JavaScriptUtils";

export default (
  container,
  gitHubUsers = [],
  gitLabUsers = [],
  proxyServerUrl = defaultProxyServerUrl
) => {
  if (!isDefined(container)) {
    throw new Error("Container CSS selector is not defined.");
  }

  if (!isDefined(gitHubUsers) || !Array.isArray(gitHubUsers)) {
    throw new Error(
      "GitHub users must be an array if provided. Omit or pass undefined to bypass this contraint."
    );
  }

  if (!isDefined(gitLabUsers) || !Array.isArray(gitLabUsers)) {
    throw new Error(
      "GitLab users must be an array if provided. Omit or pass undefined to bypass this contraint."
    );
  }

  return main.processParams(
    container,
    gitHubUsers,
    gitLabUsers,
    proxyServerUrl
  );
};
