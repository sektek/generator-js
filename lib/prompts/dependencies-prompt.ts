import { PromptBuilder } from '@sektek/generator';

// A fresh array per call, so no resolved answer shares a mutable default.
const emptyList = (): string[] => [];

export const dependenciesPrompt = new PromptBuilder().create({
  name: 'dependencies',
  type: 'list',
  label: 'Dependencies to add (package or package@version, comma-delimited)',
  provider: emptyList,
});

export const devDependenciesPrompt = new PromptBuilder().create({
  name: 'devDependencies',
  type: 'list',
  label:
    'Dev dependencies to add (package or package@version, comma-delimited)',
  provider: emptyList,
});
