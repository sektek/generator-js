import latestVersion, { type Options } from 'latest-version';

export type VersionResolver = (
  name: string,
  version?: string,
) => Promise<string>;

// Anything the caller already spelled out as a range/wildcard rather than a
// bare version — `^`/`~`/`>`/`<`/`|` operators, a `1.x`/`2.X` wildcard
// segment, a bare `*`, or whitespace (a hyphen range like `1.2.3 - 2.3.4`,
// or a space-separated comparator set like `>=1.0.0 <2.0.0`). A dist-tag
// (`latest`, `next`, `beta`, ...) doesn't match this and is treated the same
// as a bare version below — resolved against the registry, then
// caret-prefixed.
const RANGE_OPERATOR_PATTERN = /[\^~<>|*]|(?:^|\.)[xX](?:\.|$)|\s/;

/**
 * Whether `version` already spells out a range/wildcard rather than a bare
 * version or dist-tag.
 *
 * @param version - The version spec to check.
 * @returns Whether `version` matches {@link RANGE_OPERATOR_PATTERN}.
 */
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
 * by default.
 *
 * A `version` that's already an explicit range/wildcard (`^18`, `~2.1.0`,
 * `>=3`, `1.x`, ...) is returned verbatim, with no registry lookup at all —
 * the caller already said exactly what they want. Anything else (nothing
 * given, a bare exact version, or a dist-tag) is resolved to a concrete
 * version via `latest-version` and returned caret-prefixed, matching npm's
 * own default save-prefix behavior (`npm install` writes `^x.y.z`, not a
 * hard pin) — so a bare version like `4.17.21` still gets resolved (mostly
 * to confirm it exists) and comes back as `^4.17.21`, not written verbatim.
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
 * `resolveLatestVersion` itself uses, so specs can exercise the real
 * caret-prefixing/range-passthrough logic above it without hitting the
 * real npm registry.
 *
 * @param fetcher - The stand-in fetcher to install.
 */
export function setLatestVersionFetcherForTesting(
  fetcher: LatestVersionFetcher,
): void {
  fetchLatestVersion = fetcher;
}

export default resolveDependencyVersion;
