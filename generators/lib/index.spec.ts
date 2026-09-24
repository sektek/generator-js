import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { expect } from 'chai';
import { helper } from '@sektek/generator-test';

import { LibGenerator } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const generator = join(__dirname, 'index.js');

// Same compose chain as @sektek/js:app (see its own spec for why each
// namespace needs registering by path, and why gitInit: false).
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
      [generatorBasePath('license'), { namespace: '@sektek/base:license' }],
      [generatorBasePath('config'), { namespace: '@sektek/base:config' }],
      [
        join(__dirname, '../base-package/index.js'),
        { namespace: '@sektek/js:base-package' },
      ],
      [
        join(__dirname, '../dependencies/index.js'),
        { namespace: '@sektek/js:dependencies' },
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

describe('@sektek/js:lib', function () {
  it('generates using LibGenerator', async function () {
    const result = await run();
    expect(result.generator).to.be.instanceOf(LibGenerator);
  });

  it('declares destinationMode: newProjectDir with subdir libs', function () {
    expect(LibGenerator.destinationMode()).to.deep.equal({
      kind: 'newProjectDir',
      subdir: 'libs',
    });
  });

  it('composes @sektek/base (editorconfig, gitconfig, readme)', async function () {
    const { fs } = await run();
    expect(fs.exists('.editorconfig')).to.be.true;
    expect(fs.exists('.gitignore')).to.be.true;
    expect(fs.exists('README.md')).to.be.true;
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

  it('composes typescript when language is typescript', async function () {
    const { fs } = await run({ language: 'typescript' });
    expect(fs.exists('tsconfig.json')).to.be.true;
    expect(fs.exists('index.ts')).to.be.true;
  });

  it('composes mocha by default', async function () {
    const { fs } = await run();
    expect(fs.exists('.mocharc.cjs')).to.be.true;
  });

  it('composes vitest when testFramework is vitest', async function () {
    const { fs } = await run({
      language: 'javascript',
      testFramework: 'vitest',
    });
    expect(fs.exists('vitest.config.ts')).to.be.true;
    expect(fs.exists('.mocharc.cjs')).to.be.false;
  });

  it('composes dependencies, adding user-supplied dependencies/devDependencies to package.json', async function () {
    const { fs } = await run({
      language: 'javascript',
      dependencies: ['lodash@4.17.21'],
    });
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.dependencies.lodash).to.equal('4.17.21');
  });
});
