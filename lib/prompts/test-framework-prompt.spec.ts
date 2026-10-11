import { expect } from 'chai';

import * as prompts from './index.js';
import { testFrameworkPrompt } from './test-framework-prompt.js';

describe('testFrameworkPrompt', function () {
  it('is a select prompt named "testFramework"', function () {
    expect(testFrameworkPrompt.name).to.equal('testFramework');
    expect(testFrameworkPrompt.type).to.equal('select');
    expect(testFrameworkPrompt.label).to.equal('Test framework');
  });

  it('offers mocha, vitest, then none', function () {
    expect(testFrameworkPrompt.choices).to.deep.equal([
      'mocha',
      'vitest',
      'none',
    ]);
  });

  it('provider resolves mocha', async function () {
    const provider = testFrameworkPrompt.provider as unknown as () => unknown;
    expect(await provider()).to.equal('mocha');
  });

  it('is exported from the prompts barrel', function () {
    expect(prompts.testFrameworkPrompt).to.equal(testFrameworkPrompt);
  });
});
