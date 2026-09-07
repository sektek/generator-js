export type DependencySection = 'dependencies' | 'devDependencies';

export type DependencyConflict = {
  section: DependencySection;
  name: string;
  existingVersion: string;
  newVersion: string;
};

/**
 * Finds every package present in both `existing` and `incoming` at
 * different version specifiers.
 *
 * @param section - Which package.json section this comparison is for.
 * @param existing - Versions already written, e.g. by an earlier-composed generator.
 * @param incoming - Versions this generator is about to write.
 * @returns The conflicts found, if any.
 */
export function detectDependencyConflicts(
  section: DependencySection,
  existing: Record<string, string>,
  incoming: Record<string, string>,
): DependencyConflict[] {
  const conflicts: DependencyConflict[] = [];

  for (const [name, newVersion] of Object.entries(incoming)) {
    const existingVersion = existing[name];
    if (existingVersion !== undefined && existingVersion !== newVersion) {
      conflicts.push({ section, name, existingVersion, newVersion });
    }
  }

  return conflicts;
}

export default detectDependencyConflicts;
