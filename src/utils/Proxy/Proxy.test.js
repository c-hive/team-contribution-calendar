import { expect } from 'chai';
import * as Proxy from './Proxy';

describe('Proxy', () => {
  const proxyServerUrl = 'https://cors-proxy.com';

  describe('getGitHubProxyUrl', () => {
    it('returns the `proxied` GitHub contributions URL', () => {
      const gitHubUsername = 'testGitHubUsername';
      const expectedUrl = `${proxyServerUrl}https://github.com/users/${gitHubUsername}/contributions`;

      const actualUrl = Proxy.getGitHubProxyUrl(proxyServerUrl, gitHubUsername);

      expect(actualUrl).to.equal(expectedUrl);
    });
  });

  describe('getGitLabProxyUrl', () => {
    it('returns the `proxied` GitLab JSON calendar URL', () => {
      const gitLabUsername = 'testGitLabUsername';
      const expectedUrl = `${proxyServerUrl}https://gitlab.com/users/${gitLabUsername}/calendar.json`;

      const actualUrl = Proxy.getGitLabProxyUrl(proxyServerUrl, gitLabUsername);

      expect(actualUrl).to.equal(expectedUrl);
    });
  });
});
