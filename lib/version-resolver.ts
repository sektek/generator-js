import latestVersion from 'latest-version';

export type VersionResolver = (
  name: string,
  version?: string,
) => Promise<string>;

/**
 * The real, npm-registry-backed resolver `resolveDependencyVersion` uses
 * by default.
 *
 * @param name - The package name.
 * @param version - An explicit version/range/tag, if pinned.
 * @returns The version string to write to package.json.
 */
async function resolveLatestVersion(
  name: string,
  version?: string,
): Promise<string> {
  return version ? latestVersion(name, { version }) : latestVersion(name);
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

export default resolveDependencyVersion;
