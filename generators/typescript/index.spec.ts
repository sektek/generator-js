import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { expect } from 'chai';
import { helper } from '@sektek/generator-test';

import { TypescriptGenerator } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const generator = join(__dirname, 'index.js');

describe('@sektek/js:typescript', function () {
  it('generates using TypescriptGenerator', async function () {
    const result = await helper
      .run(generator)
      .withOptions({ language: 'typescript' });
    expect(result.generator).to.be.instanceOf(TypescriptGenerator);
  });

  it('generates tsconfig files and a TS entrypoint', async function () {
    const { fs } = await helper
      .run(generator)
      .withOptions({ language: 'typescript', testFramework: 'mocha' });
    expect(fs.exists('tsconfig.json')).to.be.true;
    expect(fs.exists('tsconfig.build.json')).to.be.true;
    expect(fs.exists('index.ts')).to.be.true;
  });

  it("does not generate an index.spec.ts of its own - that is the composed test-framework generator's job", async function () {
    const { fs } = await helper
      .run(generator)
      .withOptions({ language: 'typescript', testFramework: 'mocha' });
    expect(fs.exists('index.spec.ts')).to.be.false;
  });

  describe('tsconfig.json "types" by testFramework', function () {
    it('defaults to mocha + node when testFramework is unset', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript' });
      const tsconfig = JSON.parse(fs.read('tsconfig.json'));
      expect(tsconfig.compilerOptions.types).to.deep.equal(['mocha', 'node']);
    });

    it('uses mocha + node for testFramework: mocha', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript', testFramework: 'mocha' });
      const tsconfig = JSON.parse(fs.read('tsconfig.json'));
      expect(tsconfig.compilerOptions.types).to.deep.equal(['mocha', 'node']);
    });

    it('uses node only for testFramework: vitest (no ambient globals - specs import explicitly)', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript', testFramework: 'vitest' });
      const tsconfig = JSON.parse(fs.read('tsconfig.json'));
      expect(tsconfig.compilerOptions.types).to.deep.equal(['node']);
    });

    it('uses node only for testFramework: none', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript', testFramework: 'none' });
      const tsconfig = JSON.parse(fs.read('tsconfig.json'));
      expect(tsconfig.compilerOptions.types).to.deep.equal(['node']);
    });

    it('falls back to mocha + node for an unexpected testFramework value, matching AppGenerator composing mocha for anything other than vitest/none', async function () {
      const { fs } = await helper.run(generator).withOptions({
        language: 'typescript',
        testFramework: 'some-future-framework',
      });
      const tsconfig = JSON.parse(fs.read('tsconfig.json'));
      expect(tsconfig.compilerOptions.types).to.deep.equal(['mocha', 'node']);
    });
  });
});
