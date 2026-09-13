import { expect, use } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';

import { stubVersionResolver } from '../test/stub-version-resolver.js';

import {
  resolveDependencyVersion,
  resolveLatestVersion,
  setLatestVersionFetcherForTesting,
  setVersionResolverForTesting,
} from './version-resolver.js';

use(sinonChai);

describe('version-resolver', function () {
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

  // Calls resolveLatestVersion directly, with the registry call faked via
  // setLatestVersionFetcherForTesting — never touches the swappable
  // `resolver` the specs above rely on staying set to stubVersionResolver.
  describe('resolveLatestVersion', function () {
    let fetchStub: SinonStub;

    beforeEach(function () {
      fetchStub = sinon.stub();
      setLatestVersionFetcherForTesting(fetchStub);
    });

    it('resolves and caret-prefixes when no version is given', async function () {
      fetchStub.resolves('18.3.1');

      expect(await resolveLatestVersion('react')).to.equal('^18.3.1');
      expect(fetchStub).to.have.been.calledOnceWith('react');
    });

    it('resolves and caret-prefixes a bare exact version', async function () {
      fetchStub.resolves('4.17.21');

      expect(await resolveLatestVersion('lodash', '4.17.21')).to.equal(
        '^4.17.21',
      );
      expect(fetchStub).to.have.been.calledOnceWith('lodash', {
        version: '4.17.21',
      });
    });

    it('resolves and caret-prefixes a dist-tag', async function () {
      fetchStub.resolves('5.10.0');

      expect(await resolveLatestVersion('npm', 'latest-5')).to.equal('^5.10.0');
      expect(fetchStub).to.have.been.calledOnceWith('npm', {
        version: 'latest-5',
      });
    });

    for (const range of ['^18', '~2.1.0', '>=3', '<=2.0.0', '1.x', '*']) {
      it(`passes an explicit range (${range}) through untouched, without calling the registry`, async function () {
        expect(await resolveLatestVersion('react', range)).to.equal(range);
        expect(fetchStub).not.to.have.been.called;
      });
    }
  });
});
