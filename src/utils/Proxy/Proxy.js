export const defaultProxyServerUrl = 'https://c-hive-proxy.herokuapp.com/';

export const getGitHubProxyUrl = gitHubUsername => `https://c-hive-proxy.herokuapp.com/https://github.com/users/${gitHubUsername}/contributions`;

export const getGitLabProxyUrl = gitLabUsername => `https://c-hive-proxy.herokuapp.com/https://gitlab.com/users/${gitLabUsername}/calendar.json`;
