import { expect } from 'chai';
import * as Proxy from './Proxy';

describe('Proxy', () => {
  describe('getGitHubProxyUrl', () => {
    it('returns the `proxied` GitHub contributions URL', () => {
      const gitHubUsername = 'testGitHubUsername';
      const expectedUrl = `https://c-hive-proxy.herokuapp.com/https://github.com/users/${gitHubUsername}/contributions`;

      const actualUrl = Proxy.getGitHubProxyUrl(gitHubUsername);

      expect(actualUrl).to.equal(expectedUrl);
    });
  });
  describe('getGitLabProxyUrl', () => {
    it('returns the `proxied` GitLab JSON calendar URL', () => {
      const gitLabUsername = 'testGitLabUsername';
      const expectedUrl = `https://c-hive-proxy.herokuapp.com/https://gitlab.com/users/${gitLabUsername}/calendar.json`;

      const actualUrl = Proxy.getGitLabProxyUrl(gitLabUsername);

      expect(actualUrl).to.equal(expectedUrl);
    });
  });
});
