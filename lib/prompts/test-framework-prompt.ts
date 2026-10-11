import { PromptBuilder } from '@sektek/generator';

/**
 * The shared "Test framework" prompt: a select between `mocha` (the default),
 * `vitest` and `none`.
 */
export const testFrameworkPrompt = new PromptBuilder().create({
  name: 'testFramework',
  type: 'select',
  label: 'Test framework',
  choices: ['mocha', 'vitest', 'none'],
  provider: () => 'mocha',
});
