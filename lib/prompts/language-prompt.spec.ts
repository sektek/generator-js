import { expect } from 'chai';

import * as prompts from './index.js';
import { languagePrompt } from './language-prompt.js';

describe('languagePrompt', function () {
  it('is a select prompt named "language"', function () {
    expect(languagePrompt.name).to.equal('language');
    expect(languagePrompt.type).to.equal('select');
    expect(languagePrompt.label).to.equal('Language');
  });

  it('offers javascript then typescript', function () {
    expect(languagePrompt.choices).to.deep.equal(['javascript', 'typescript']);
  });

  it('provider resolves javascript', async function () {
    const provider = languagePrompt.provider as unknown as () => unknown;
    expect(await provider()).to.equal('javascript');
  });

  it('is exported from the prompts barrel', function () {
    expect(prompts.languagePrompt).to.equal(languagePrompt);
  });
});
