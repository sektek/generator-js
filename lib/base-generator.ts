import { CoreGenerator } from '@sektek/generator';

import { BaseConfig } from './types/base-config.js';
import { BaseFeatures } from './types/base-features.js';
import { BaseOptions } from './types/base-options.js';
import { detectDependencyConflicts } from './detect-dependency-conflicts.js';
import { resolveDependencyVersion } from './version-resolver.js';
import { sortPackageJsonDependencies } from './sort-package-json-dependencies.js';

type PackageDependencies = Record<string, string>;

const DEFAULT_OPTIONS: Partial<BaseOptions> = {
  packageScope: 'sektek',
  author: 'Edward Kelly <eddie@sektek.net>',
  license: 'UNLICENSED',
  private: true,
};

export class BaseGenerator<
  C extends BaseConfig = BaseConfig,
  O extends BaseOptions = BaseOptions,
  F extends BaseFeatures = BaseFeatures,
> extends CoreGenerator<C, O, F> {
  package = '@sektek/js';
  dependencies: Record<string, string> = {};
  devDependencies: Record<string, string> = {};

  constructor(args: string[], options: O, features?: F) {
    super(args, { ...DEFAULT_OPTIONS, ...options }, features);

    this.queueTask({
      method: () => sortPackageJsonDependencies(this),
      taskName: 'sortPackageJsonDependencies',
      queueName: 'transform',
      once: true,
    });
  }

  async addDependency(name: string, version?: string) {
    this.dependencies[name] = await resolveDependencyVersion(name, version);
  }

  async addDevDependency(name: string, version?: string) {
    this.devDependencies[name] = await resolveDependencyVersion(name, version);
  }

  writeDependencies() {
    const { dependencies, devDependencies } = this;
    const packageJsonPath = this.destinationPath('package.json');
    const existing = this.fs.readJSON(packageJsonPath, {}) as {
      dependencies?: PackageDependencies;
      devDependencies?: PackageDependencies;
    };

    for (const conflict of [
      ...detectDependencyConflicts(
        'dependencies',
        existing.dependencies ?? {},
        dependencies,
      ),
      ...detectDependencyConflicts(
        'devDependencies',
        existing.devDependencies ?? {},
        devDependencies,
      ),
    ]) {
      this.log(
        `${conflict.section}["${conflict.name}"]: overwriting ${conflict.existingVersion} with ${conflict.newVersion}`,
      );
    }

    this.fs.extendJSON(packageJsonPath, { dependencies, devDependencies });
  }
}

export default BaseGenerator;
