export type DependencySpec = {
  name: string;
  version?: string;
};

/**
 * Parses a dependency spec string in either `package-name` or
 * `package-name@1.2.3` format into its name/version parts.
 *
 * Scoped packages (`@scope/name`, `@scope/name@1.2.3`) are handled by only
 * ever splitting on the *last* `@` in the string, and never on an `@` at
 * index 0 (that's the scope marker, not a version separator) - so
 * `@scope/name` (one `@`, at index 0) is left whole, while
 * `@scope/name@1.2.3` (two `@`s) splits on the second.
 *
 * @param spec - a package name, optionally suffixed with `@<version>`.
 * @returns the parsed `{ name, version }`, `version` undefined when not given.
 */
export const parseDependencySpec = (spec: string): DependencySpec => {
  const lastAt = spec.lastIndexOf('@');

  if (lastAt <= 0) {
    return { name: spec };
  }

  return {
    name: spec.slice(0, lastAt),
    version: spec.slice(lastAt + 1),
  };
};

export default parseDependencySpec;
