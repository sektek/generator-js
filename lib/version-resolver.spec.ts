import { expect } from 'chai';

import { stubVersionResolver } from '../test/stub-version-resolver.js';

import {
  resolveDependencyVersion,
  setVersionResolverForTesting,
} from './version-resolver.js';

describe('resolveDependencyVersion', function () {
  afterEach(function () {
    setVersionResolverForTesting(stubVersionResolver);
  });

  it('delegates to whatever resolver is currently installed', async function () {
    setVersionResolverForTesting(
      async (name, version) => `${name}-${version ?? 'latest'}`,
    );

    expect(await resolveDependencyVersion('lodash', '4.17.21')).to.equal(
      'lodash-4.17.21',
    );
    expect(await resolveDependencyVersion('chalk')).to.equal('chalk-latest');
  });
});
