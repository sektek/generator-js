import { PromptBuilder } from '@sektek/generator';

/**
 * The shared "Private package?" prompt. Skipped for `UNLICENSED` packages,
 * where it resolves to its own default (`true`).
 */
export const privatePrompt = new PromptBuilder().create({
  name: 'private',
  type: 'boolean',
  label: 'Private package?',
  provider: () => true,
  includePrompt: context => context.answers.license !== 'UNLICENSED',
});
