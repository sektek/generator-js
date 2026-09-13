import latestVersion, { type Options } from 'latest-version';

export type VersionResolver = (
  name: string,
  version?: string,
) => Promise<string>;

// Matches an explicit range/wildcard (^, ~, >, <, |, a 1.x-style segment, a
// bare *, or whitespace for a hyphen/multi-comparator range) — not a bare
// version or dist-tag.
const RANGE_OPERATOR_PATTERN = /[\^~<>|*]|(?:^|\.)[xX](?:\.|$)|\s/;

function hasExplicitRange(version: string): boolean {
  return RANGE_OPERATOR_PATTERN.test(version);
}

type LatestVersionFetcher = (
  name: string,
  options?: Options,
) => Promise<string>;

let fetchLatestVersion: LatestVersionFetcher = latestVersion;

/**
 * The real, npm-registry-backed resolver `resolveDependencyVersion` uses
 * by default. An explicit range/wildcard is returned verbatim with no
 * registry call; anything else is resolved via `latest-version` and
 * returned caret-prefixed, matching npm's own default save-prefix
 * behavior.
 *
 * @param name - The package name.
 * @param version - An explicit version/range/tag, if pinned.
 * @returns The version string to write to package.json.
 */
export async function resolveLatestVersion(
  name: string,
  version?: string,
): Promise<string> {
  if (version !== undefined && hasExplicitRange(version)) {
    return version;
  }

  const resolved = version
    ? await fetchLatestVersion(name, { version })
    : await fetchLatestVersion(name);
  return `^${resolved}`;
}

let resolver: VersionResolver = resolveLatestVersion;

/**
 * Resolves the version to write for a dependency, via whichever resolver
 * is currently installed (real npm-registry lookups via latest-version by
 * default).
 *
 * @param name - The package name.
 * @param version - An explicit version/range/tag, if pinned.
 * @returns The version string to write to package.json.
 */
export function resolveDependencyVersion(
  name: string,
  version?: string,
): Promise<string> {
  return resolver(name, version);
}

/**
 * Test-only escape hatch: swaps the resolver every `BaseGenerator` uses
 * for `addDependency`/`addDevDependency`, so specs can avoid real
 * npm-registry calls.
 *
 * @param testResolver - The stand-in resolver to install.
 */
export function setVersionResolverForTesting(
  testResolver: VersionResolver,
): void {
  resolver = testResolver;
}

/**
 * Test-only escape hatch: swaps the underlying `latest-version` fetcher
 * `resolveLatestVersion` uses, so specs can exercise its own logic without
 * hitting the real npm registry.
 *
 * @param fetcher - The stand-in fetcher to install.
 */
export function setLatestVersionFetcherForTesting(
  fetcher: LatestVersionFetcher,
): void {
  fetchLatestVersion = fetcher;
}

export default resolveDependencyVersion;
