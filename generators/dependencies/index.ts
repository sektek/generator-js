import { BaseConfig } from '../../lib/types/base-config.js';
import { BaseFeatures } from '../../lib/types/base-features.js';
import { BaseGenerator } from '../../lib/base-generator.js';
import { BaseOptions } from '../../lib/types/base-options.js';
import { parseDependencySpec } from '../../lib/parse-dependency-spec.js';

const DEFAULT_FEATURES: Partial<BaseFeatures> = {
  unique: true,
};

export class DependenciesGenerator extends BaseGenerator<
  BaseConfig,
  BaseOptions,
  BaseFeatures
> {
  constructor(
    args: string[],
    options: BaseOptions,
    features: BaseFeatures = {} as BaseFeatures,
  ) {
    super(args, options, { ...DEFAULT_FEATURES, ...features });
  }

  async taskDefault() {
    const { options } = this;
    const { dependencies = [], devDependencies = [] } = options;

    for (const spec of dependencies) {
      const { name, version } = parseDependencySpec(spec);
      await this.addDependency(name, version);
    }

    for (const spec of devDependencies) {
      const { name, version } = parseDependencySpec(spec);
      await this.addDevDependency(name, version);
    }
  }

  taskWriting() {
    this.writeDependencies();
  }
}

export default DependenciesGenerator;
