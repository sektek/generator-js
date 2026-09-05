import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { expect } from 'chai';
import { helper } from '@sektek/generator-test';

import {
  TEST_COVER_SCRIPT,
  TEST_SCRIPT,
  TEST_WATCH_SCRIPT,
  VitestGenerator,
} from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const generator = join(__dirname, 'index.js');

describe('@sektek/js:vitest', function () {
  it('generates using VitestGenerator', async function () {
    const result = await helper
      .run(generator)
      .withOptions({ language: 'javascript' });
    expect(result.generator).to.be.instanceOf(VitestGenerator);
  });

  it('generates a vitest.config.ts', async function () {
    const { fs } = await helper
      .run(generator)
      .withOptions({ language: 'javascript' });
    expect(fs.exists('vitest.config.ts')).to.be.true;
  });

  it('generates a vitest.config.ts with the include glob and coverage thresholds', async function () {
    const { fs } = await helper
      .run(generator)
      .withOptions({ language: 'javascript' });
    const config = fs.read('vitest.config.ts');
    expect(config).to.include("include: ['**/*.spec.{js,ts}']");
    expect(config).to.include("include: ['index.{js,ts}', 'src/**/*.{js,ts}']");
    expect(config).to.include('lines: 90');
    expect(config).to.include('branches: 90');
    expect(config).to.include('functions: 90');
    expect(config).to.include('statements: 90');
  });

  it('generates test, test:watch, and test:cover scripts', async function () {
    const { fs } = await helper
      .run(generator)
      .withOptions({ language: 'javascript' });
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.scripts.test).to.equal(TEST_SCRIPT);
    expect(pkg.scripts['test:watch']).to.equal(TEST_WATCH_SCRIPT);
    expect(pkg.scripts['test:cover']).to.equal(TEST_COVER_SCRIPT);
  });

  describe('with language: javascript', function () {
    it('generates an index.spec.js entrypoint using native vitest imports', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'javascript' });
      expect(fs.exists('index.spec.js')).to.be.true;
      expect(fs.exists('index.spec.ts')).to.be.false;
      const spec = fs.read('index.spec.js');
      expect(spec).to.include("import { describe, expect, it } from 'vitest';");
      expect(spec).to.include('expect(true).to.be.true;');
    });
  });

  describe('with language: typescript', function () {
    it('generates an index.spec.ts entrypoint using native vitest imports', async function () {
      const { fs } = await helper
        .run(generator)
        .withOptions({ language: 'typescript' });
      expect(fs.exists('index.spec.ts')).to.be.true;
      expect(fs.exists('index.spec.js')).to.be.false;
      const spec = fs.read('index.spec.ts');
      expect(spec).to.include("import { describe, expect, it } from 'vitest';");
      expect(spec).to.include('expect(true).to.be.true;');
    });
  });
});
