import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { expect } from 'chai';
import { helper } from '@sektek/generator-test';

import { AppGenerator } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const generator = join(__dirname, 'index.js');

// AppGenerator's compose chain reaches two levels deep: app -> @sektek/base:app
// -> editorconfig/git/gitconfig/github/readme/devcontainer, and app -> eslint
// -> prettier. The shared test helper has nothing registered under any of
// these namespaces by default, so every namespace actually reached anywhere
// in the chain must be registered by path (registering by class reference
// instead would break templatePath()/sourceRoot() resolution for whichever
// generator it's used on). Resolved via @sektek/generator-base's own package
// exports (an installed npm dependency, not a monorepo sibling directory)
// rather than a relative path, since this package no longer lives next to
// generator-base on disk.
//
// gitInit: false in run()'s default options — these tests are about
// composition (each sub-generator produces its expected files), not git's
// own behavior (already covered by its own fully-mocked spec in
// generator-base). Without this, git's real taskEnd runs a real `git init`/
// `git commit` against the test's on-disk temp fixture, which depends on the
// running machine having a git identity configured — CI runners don't by
// default, so this would fail in CI with "Please tell me who you are" even
// though it can pass locally on a machine with a configured identity.
// createRepo defaults to false/undefined and these runs never set it, so
// github's own taskEnd already no-ops regardless.
const generatorBasePath = (name: string) =>
  fileURLToPath(
    import.meta.resolve(`@sektek/generator-base/generators/${name}`),
  );

const run = (options: Record<string, unknown> = { language: 'javascript' }) =>
  helper
    .run(generator)
    .withOptions({ gitInit: false, ...options })
    .withGenerators([
      [generatorBasePath('app'), { namespace: '@sektek/base:app' }],
      [
        generatorBasePath('editorconfig'),
        { namespace: '@sektek/base:editorconfig' },
      ],
      [generatorBasePath('gitconfig'), { namespace: '@sektek/base:gitconfig' }],
      [generatorBasePath('readme'), { namespace: '@sektek/base:readme' }],
      [
        generatorBasePath('devcontainer'),
        { namespace: '@sektek/base:devcontainer' },
      ],
      [generatorBasePath('git'), { namespace: '@sektek/base:git' }],
      [generatorBasePath('github'), { namespace: '@sektek/base:github' }],
      [
        join(__dirname, '../base-package/index.js'),
        { namespace: '@sektek/js:base-package' },
      ],
      [
        join(__dirname, '../gitconfig/index.js'),
        { namespace: '@sektek/js:gitconfig' },
      ],
      [
        join(__dirname, '../typescript/index.js'),
        { namespace: '@sektek/js:typescript' },
      ],
      [
        join(__dirname, '../eslint/index.js'),
        { namespace: '@sektek/js:eslint' },
      ],
      [
        join(__dirname, '../prettier/index.js'),
        { namespace: '@sektek/js:prettier' },
      ],
      [join(__dirname, '../mocha/index.js'), { namespace: '@sektek/js:mocha' }],
      [
        join(__dirname, '../vitest/index.js'),
        { namespace: '@sektek/js:vitest' },
      ],
    ]);

describe('@sektek/js:app', function () {
  it('generates using AppGenerator', async function () {
    const result = await run();
    expect(result.generator).to.be.instanceOf(AppGenerator);
  });

  it('composes @sektek/base (editorconfig, gitconfig, readme)', async function () {
    const { fs } = await run();
    expect(fs.exists('.editorconfig')).to.be.true;
    expect(fs.exists('.gitignore')).to.be.true;
    expect(fs.exists('README.md')).to.be.true;
  });

  it('layers JS-specific gitignore rules on top of the base gitignore', async function () {
    const { fs } = await run();
    const gitignore = fs.read('.gitignore');
    expect(gitignore).to.include('END BASE GITIGNORE');
    expect(gitignore).to.include('BEGIN JavaScript');
  });

  it('composes base-package', async function () {
    const { fs } = await run();
    expect(fs.exists('package.json')).to.be.true;
  });

  it('composes eslint and prettier', async function () {
    const { fs } = await run();
    expect(fs.exists('eslint.config.js')).to.be.true;
    expect(fs.exists('.prettierrc.js')).to.be.true;
  });

  it('composes mocha by default', async function () {
    const { fs } = await run();
    expect(fs.exists('.mocharc.cjs')).to.be.true;
  });

  it('composes mocha when testFramework is explicitly mocha', async function () {
    const { fs } = await run({
      language: 'javascript',
      testFramework: 'mocha',
    });
    expect(fs.exists('.mocharc.cjs')).to.be.true;
    expect(fs.exists('vitest.config.ts')).to.be.false;
  });

  it('composes vitest when testFramework is vitest', async function () {
    const { fs } = await run({
      language: 'javascript',
      testFramework: 'vitest',
    });
    expect(fs.exists('vitest.config.ts')).to.be.true;
    expect(fs.exists('.mocharc.cjs')).to.be.false;
  });

  it('composes neither test generator when testFramework is none', async function () {
    const { fs } = await run({ language: 'javascript', testFramework: 'none' });
    expect(fs.exists('.mocharc.cjs')).to.be.false;
    expect(fs.exists('vitest.config.ts')).to.be.false;
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.scripts.test).to.be.undefined;
    expect(pkg.scripts['test:cover']).to.be.undefined;
  });

  it('composes devcontainer, using the sektek/devcontainer-base image', async function () {
    const { fs } = await run();
    expect(fs.exists('.devcontainer/devcontainer.json')).to.be.true;
    expect(fs.read('.devcontainer/Dockerfile')).to.include(
      'sektek/devcontainer-base',
    );
  });

  it('composes typescript when language is typescript', async function () {
    const { fs } = await run({ language: 'typescript' });
    expect(fs.exists('tsconfig.json')).to.be.true;
    expect(fs.exists('index.ts')).to.be.true;
  });

  it('does not compose typescript when language is javascript', async function () {
    const { fs } = await run({ language: 'javascript' });
    expect(fs.exists('tsconfig.json')).to.be.false;
  });

  it('sorts merged package.json dependencies/devDependencies alphabetically', async function () {
    const { fs } = await run({ language: 'typescript' });
    const pkg = JSON.parse(fs.read('package.json'));
    const sorted = (obj: Record<string, string>) =>
      [...Object.keys(obj)].sort((a, b) => a.localeCompare(b, 'en'));

    expect(Object.keys(pkg.dependencies)).to.deep.equal(
      sorted(pkg.dependencies),
    );
    expect(Object.keys(pkg.devDependencies)).to.deep.equal(
      sorted(pkg.devDependencies),
    );
    const devDepKeys = Object.keys(pkg.devDependencies);
    expect(devDepKeys.indexOf('@sektek/eslint-plugin')).to.be.lessThan(
      devDepKeys.indexOf('eslint'),
    );
  });
});
