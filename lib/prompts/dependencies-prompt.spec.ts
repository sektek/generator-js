import { expect } from 'chai';

import {
  dependenciesPrompt,
  devDependenciesPrompt,
} from './dependencies-prompt.js';

type Provider = () => unknown;

describe('dependency prompts', function () {
  const cases = [
    {
      prompt: dependenciesPrompt,
      name: 'dependencies',
      label:
        'Dependencies to add (package or package@version, comma-delimited)',
    },
    {
      prompt: devDependenciesPrompt,
      name: 'devDependencies',
      label:
        'Dev dependencies to add (package or package@version, comma-delimited)',
    },
  ];

  for (const { prompt, name, label } of cases) {
    describe(name, function () {
      it('is a list prompt with the expected name and label', function () {
        expect(prompt.name).to.equal(name);
        expect(prompt.type).to.equal('list');
        expect(prompt.label).to.equal(label);
      });

      it('provides a fresh empty array on each call', function () {
        const provider = prompt.provider as unknown as Provider;
        const first = provider();
        const second = provider();

        expect(first).to.deep.equal([]);
        expect(second).to.deep.equal([]);
        expect(first).to.not.equal(second);
      });
    });
  }
});
