import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { expect } from 'chai';
import { helper } from '@sektek/generator-test';

import { STUB_VERSION } from '../../test/stub-version-resolver.js';

import { DependenciesGenerator } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const generator = join(__dirname, 'index.js');

describe('@sektek/js:dependencies', function () {
  it('generates using DependenciesGenerator', async function () {
    const result = await helper
      .run(generator)
      .withOptions({ language: 'javascript' });
    expect(result.generator).to.be.instanceOf(DependenciesGenerator);
  });

  it('does nothing when neither dependencies nor devDependencies are given', async function () {
    const { fs } = await helper
      .run(generator)
      .withOptions({ language: 'javascript' });
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.dependencies).to.deep.equal({});
    expect(pkg.devDependencies).to.deep.equal({});
  });

  it('adds unversioned entries from options.dependencies, resolving a version', async function () {
    const { fs } = await helper.run(generator).withOptions({
      language: 'javascript',
      dependencies: ['lodash'],
    });
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.dependencies.lodash).to.equal(STUB_VERSION);
  });

  it('adds a package-name@version entry from options.dependencies at the pinned version', async function () {
    const { fs } = await helper.run(generator).withOptions({
      language: 'javascript',
      dependencies: ['lodash@4.17.21'],
    });
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.dependencies.lodash).to.equal('4.17.21');
  });

  it('adds a scoped package-name@version entry from options.dependencies', async function () {
    const { fs } = await helper.run(generator).withOptions({
      language: 'javascript',
      dependencies: ['@types/node@22.0.0'],
    });
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.dependencies['@types/node']).to.equal('22.0.0');
  });

  it('adds entries from options.devDependencies as devDependencies, not dependencies', async function () {
    const { fs } = await helper.run(generator).withOptions({
      language: 'javascript',
      devDependencies: ['lodash@4.17.21'],
    });
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.devDependencies.lodash).to.equal('4.17.21');
    expect(pkg.dependencies.lodash).to.be.undefined;
  });

  it('adds dependencies and devDependencies together in one run', async function () {
    const { fs } = await helper.run(generator).withOptions({
      language: 'javascript',
      dependencies: ['lodash@4.17.21'],
      devDependencies: ['chalk@5.3.0'],
    });
    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.dependencies.lodash).to.equal('4.17.21');
    expect(pkg.devDependencies.chalk).to.equal('5.3.0');
  });
});
