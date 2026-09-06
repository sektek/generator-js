import { expect } from 'chai';

import { parseDependencySpec } from './parse-dependency-spec.js';

describe('parseDependencySpec', function () {
  it('parses a bare package name with no version', function () {
    expect(parseDependencySpec('lodash')).to.deep.equal({ name: 'lodash' });
  });

  it('parses a package-name@version spec', function () {
    expect(parseDependencySpec('lodash@4.17.21')).to.deep.equal({
      name: 'lodash',
      version: '4.17.21',
    });
  });

  it('parses a scoped package name with no version, without splitting on the scope marker', function () {
    expect(parseDependencySpec('@scope/name')).to.deep.equal({
      name: '@scope/name',
    });
  });

  it('parses a scoped package-name@version spec, splitting on the last @ only', function () {
    expect(parseDependencySpec('@scope/name@1.2.3')).to.deep.equal({
      name: '@scope/name',
      version: '1.2.3',
    });
  });

  it('parses a scoped package pinned to a dist-tag rather than a semver', function () {
    expect(parseDependencySpec('@scope/name@next')).to.deep.equal({
      name: '@scope/name',
      version: 'next',
    });
  });
});
