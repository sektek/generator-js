import { PromptBuilder } from '@sektek/generator';

/**
 * The shared "Language" prompt: a select between `javascript` (the default)
 * and `typescript`.
 */
export const languagePrompt = new PromptBuilder().create({
  name: 'language',
  type: 'select',
  label: 'Language',
  choices: ['javascript', 'typescript'],
  provider: () => 'javascript',
});
