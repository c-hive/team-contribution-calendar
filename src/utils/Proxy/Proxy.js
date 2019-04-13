export const defaultProxyServerUrl = 'https://c-hive-proxy.herokuapp.com/';

export const getGitHubProxyUrl = (proxyServerUrl, gitHubUsername) => `${proxyServerUrl}https://github.com/users/${gitHubUsername}/contributions`;

export const getGitLabProxyUrl = (proxyServerUrl, gitLabUsername) => `${proxyServerUrl}https://gitlab.com/users/${gitLabUsername}/calendar.json`;
