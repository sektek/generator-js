import { GithubClient, defaultGithubClient } from '@sektek/generator-base';
import { PromptBuilder, PromptContext, clearable } from '@sektek/generator';

/**
 * Builds the npm-scope prompt. The default is empty when no GitHub repo is
 * being created, the named `repoOwner` when one was given, or the
 * authenticated GitHub user's login otherwise. Never throws: any failure
 * resolving the user yields an empty default the user can type over.
 *
 * @param clientFactory - Supplies the GitHub client; injectable for tests.
 * @returns The `packageScope` prompt.
 */
export const createPackageScopePrompt = (
  clientFactory: () => GithubClient = defaultGithubClient,
) =>
  new PromptBuilder().create({
    name: 'packageScope',
    type: 'text',
    label: 'npm scope',
    capabilities: [clearable],
    provider: async ({ answers }: PromptContext): Promise<string> => {
      if (!answers.createRepo) {
        return '';
      }

      if (typeof answers.repoOwner === 'string' && answers.repoOwner !== '') {
        return answers.repoOwner;
      }

      try {
        const client = clientFactory();
        const token = await client.resolveToken(
          typeof answers.githubToken === 'string'
            ? answers.githubToken
            : undefined,
        );
        const { login } = await client.getAuthenticatedUser({ token });
        return login;
      } catch {
        return '';
      }
    },
  });

export const packageScopePrompt = createPackageScopePrompt();
