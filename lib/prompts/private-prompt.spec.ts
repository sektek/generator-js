import { PromptContext } from '@sektek/generator';
import { expect } from 'chai';

import * as prompts from './index.js';
import { privatePrompt } from './private-prompt.js';

const contextFor = (answers: Record<string, unknown>): PromptContext =>
  ({ answers, flagsGiven: {}, configDefaults: {} }) as PromptContext;

const include = privatePrompt.includePrompt as unknown as (
  context: PromptContext,
) => boolean;

describe('privatePrompt', function () {
  it('is a boolean prompt named "private"', function () {
    expect(privatePrompt.name).to.equal('private');
    expect(privatePrompt.type).to.equal('boolean');
    expect(privatePrompt.label).to.equal('Private package?');
  });

  it('provider resolves true', async function () {
    const provider = privatePrompt.provider as unknown as () => unknown;
    expect(await provider()).to.equal(true);
  });

  it('is skipped for UNLICENSED', function () {
    expect(include(contextFor({ license: 'UNLICENSED' }))).to.equal(false);
  });

  it('is included for MIT', function () {
    expect(include(contextFor({ license: 'MIT' }))).to.equal(true);
  });

  it('is included when license is undefined', function () {
    expect(include(contextFor({}))).to.equal(true);
  });

  it('is exported from the prompts barrel', function () {
    expect(prompts.privatePrompt).to.equal(privatePrompt);
  });
});
