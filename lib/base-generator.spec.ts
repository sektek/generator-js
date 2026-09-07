import { expect, use } from 'chai';
import { helper } from '@sektek/generator-test';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { BaseGenerator } from './base-generator.js';

use(sinonChai);

class ConflictingWriterGenerator extends BaseGenerator {
  logSpy = sinon.spy(this, 'log');

  // Simulates an earlier-composed generator having already written this
  // dependency to the shared package.json before this one's writeDependencies() runs.
  taskInitializing() {
    this.fs.extendJSON(this.destinationPath('package.json'), {
      dependencies: { typescript: '7.0.2' },
    });
  }

  taskWriting() {
    this.dependencies = { typescript: '4.9.5' };
    this.writeDependencies();
  }
}

class SameVersionWriterGenerator extends ConflictingWriterGenerator {
  taskWriting() {
    this.dependencies = { typescript: '7.0.2' };
    this.writeDependencies();
  }
}

const run = (generator: typeof ConflictingWriterGenerator) =>
  helper.run(generator).withOptions({ language: 'javascript' });

describe('BaseGenerator#writeDependencies', function () {
  it('logs a conflict when a package already has a different version written', async function () {
    const { fs, generator } = await run(ConflictingWriterGenerator);

    const pkg = JSON.parse(fs.read('package.json'));
    expect(pkg.dependencies.typescript).to.equal('4.9.5');
    expect(
      (generator as ConflictingWriterGenerator).logSpy,
    ).to.have.been.calledWith(
      'dependencies["typescript"]: overwriting 7.0.2 with 4.9.5',
    );
  });

  it('logs nothing when there is no version conflict', async function () {
    const { generator } = await run(SameVersionWriterGenerator);

    expect((generator as ConflictingWriterGenerator).logSpy).to.not.have.been
      .called;
  });
});
