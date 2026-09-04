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
    expect(fs.exists('index.spec.ts')).to.be.true;
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

    it('uses vitest/globals + node for testFramework: vitest', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript', testFramework: 'vitest' });
      const tsconfig = JSON.parse(fs.read('tsconfig.json'));
      expect(tsconfig.compilerOptions.types).to.deep.equal([
        'vitest/globals',
        'node',
      ]);
    });

    it('uses node only for testFramework: none', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript', testFramework: 'none' });
      const tsconfig = JSON.parse(fs.read('tsconfig.json'));
      expect(tsconfig.compilerOptions.types).to.deep.equal(['node']);
    });
  });

  describe('index.spec.ts by testFramework', function () {
    it('imports chai and uses BDD assertions for testFramework: mocha', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript', testFramework: 'mocha' });
      const spec = fs.read('index.spec.ts');
      expect(spec).to.include("import { expect } from 'chai';");
      expect(spec).to.include('expect(true).to.be.true;');
    });

    it('imports from vitest and uses Jest-style assertions for testFramework: vitest', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript', testFramework: 'vitest' });
      const spec = fs.read('index.spec.ts');
      expect(spec).to.include("import { describe, expect, it } from 'vitest';");
      expect(spec).to.include('expect(true).toBe(true);');
    });

    it('does not generate index.spec.ts for testFramework: none', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript', testFramework: 'none' });
      expect(fs.exists('index.spec.ts')).to.be.false;
      expect(fs.exists('index.ts')).to.be.true;
    });
  });
});
