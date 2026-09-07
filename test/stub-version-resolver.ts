import {
  VersionResolver,
  setVersionResolverForTesting,
} from '../lib/version-resolver.js';

// Preloaded once for the whole test process (see .mocharc.cjs's `require`):
// addDependency/addDevDependency otherwise hit the real npm registry via
// latest-version for every generator every spec runs, which is slow and, on
// CI, flaky (real HTTP round trips racking up past mocha's default per-test
// timeout). No spec here is testing latest-version's own behavior, so a
// deterministic stand-in is enough; an explicitly pinned version is still
// returned verbatim.
export const stubVersionResolver: VersionResolver = async (_name, version) =>
  version ?? '0.0.0-stub';

setVersionResolverForTesting(stubVersionResolver);
