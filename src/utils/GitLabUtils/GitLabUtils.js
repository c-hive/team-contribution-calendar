/* eslint-disable no-console */

import * as proxy from "../Proxy/Proxy";
import * as javaScriptUtils from "../JavaScriptUtils/JavaScriptUtils";

export const getJsonFormattedCalendarAsync = async (
  proxyServerUrl,
  gitLabUsername
) => {
  const url = proxy.getGitLabProxyUrl(proxyServerUrl, gitLabUsername);
  const responseData = await fetch(url);

  if (javaScriptUtils.isSuccess(responseData.status)) {
    return responseData.json().then(parsedCalendar => ({
      parsedCalendar,
      error: false,
      errorMessage: null
    }));
  }

  return {
    error: true,
    errorMessage: `Could not fetch the calendar of ${gitLabUsername}.`
  };
};
