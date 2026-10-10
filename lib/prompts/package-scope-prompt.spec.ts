import { GithubClient } from '@sektek/generator-base';
import { PromptContext } from '@sektek/generator';
import { expect } from 'chai';

import { createPackageScopePrompt } from './package-scope-prompt.js';

type Provider = (context: PromptContext) => Promise<string>;

const contextWith = (answers: Record<string, unknown>): PromptContext => ({
  answers,
  flagsGiven: {},
  configDefaults: {},
});

const fakeClient = (login: string | Error): GithubClient =>
  ({
    resolveToken: async () => 'token',
    getAuthenticatedUser: async () => {
      if (login instanceof Error) {
        throw login;
      }
      return { login };
    },
  }) as unknown as GithubClient;

const resolve = (client: GithubClient, answers: Record<string, unknown>) =>
  (createPackageScopePrompt(() => client).provider as Provider)(
    contextWith(answers),
  );

describe('packageScopePrompt', function () {
  it('should be a clearable text prompt named packageScope', function () {
    const prompt = createPackageScopePrompt(() => fakeClient('me'));
    expect(prompt.name).to.equal('packageScope');
    expect(prompt.type).to.equal('text');
    expect(prompt.label).to.equal('npm scope');
    expect(prompt.capabilities).to.deep.equal([{ type: 'clearable' }]);
  });

  it('should default to empty when createRepo is falsy', async function () {
    expect(await resolve(fakeClient('me'), {})).to.equal('');
  });

  it('should use repoOwner when given', async function () {
    const answers = { createRepo: true, repoOwner: 'acme' };
    expect(await resolve(fakeClient('me'), answers)).to.equal('acme');
  });

  it('should use the authenticated login when repoOwner is blank', async function () {
    const answers = { createRepo: true, repoOwner: '' };
    expect(await resolve(fakeClient('me'), answers)).to.equal('me');
  });

  it('should default to empty when the client fails', async function () {
    const answers = { createRepo: true };
    expect(await resolve(fakeClient(new Error('boom')), answers)).to.equal('');
  });
});
