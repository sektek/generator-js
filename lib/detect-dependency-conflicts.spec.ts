import { expect } from 'chai';

import { detectDependencyConflicts } from './detect-dependency-conflicts.js';

describe('detectDependencyConflicts', function () {
  it('returns a conflict when the same package has two different versions', function () {
    const conflicts = detectDependencyConflicts(
      'devDependencies',
      { typescript: '7.0.2' },
      { typescript: '4.9.5' },
    );

    expect(conflicts).to.deep.equal([
      {
        section: 'devDependencies',
        name: 'typescript',
        existingVersion: '7.0.2',
        newVersion: '4.9.5',
      },
    ]);
  });

  it('returns nothing when the versions match', function () {
    const conflicts = detectDependencyConflicts(
      'dependencies',
      { lodash: '^4.17.21' },
      { lodash: '^4.17.21' },
    );

    expect(conflicts).to.deep.equal([]);
  });

  it('returns nothing for a package only present in one side', function () {
    const conflicts = detectDependencyConflicts(
      'dependencies',
      { lodash: '^4.17.21' },
      { chalk: '^5.0.0' },
    );

    expect(conflicts).to.deep.equal([]);
  });

  it('reports every conflicting package, ignoring non-conflicting ones', function () {
    const conflicts = detectDependencyConflicts(
      'dependencies',
      { a: '1.0.0', b: '2.0.0', c: '3.0.0' },
      { a: '1.0.0', b: '2.5.0', c: '3.5.0' },
    );

    expect(conflicts).to.deep.equal([
      {
        section: 'dependencies',
        name: 'b',
        existingVersion: '2.0.0',
        newVersion: '2.5.0',
      },
      {
        section: 'dependencies',
        name: 'c',
        existingVersion: '3.0.0',
        newVersion: '3.5.0',
      },
    ]);
  });
});
