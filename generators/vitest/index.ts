import { BaseConfig } from '../../lib/types/base-config.js';
import { BaseFeatures } from '../../lib/types/base-features.js';
import { BaseGenerator } from '../../lib/base-generator.js';
import { BaseOptions } from '../../lib/types/base-options.js';

const DEFAULT_FEATURES: Partial<BaseFeatures> = {
  unique: true,
};

export const TEST_SCRIPT = 'vitest run';
export const TEST_WATCH_SCRIPT = 'vitest';
export const TEST_COVER_SCRIPT = 'vitest run --coverage';

export class VitestGenerator extends BaseGenerator<
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
    await this.addDevDependency('vitest');
    await this.addDevDependency('@vitest/coverage-v8');
  }

  taskWriting() {
    this.fs.copyTpl(
      this.templatePath('vitest.config.ts.ejs'),
      this.destinationPath('vitest.config.ts'),
      {},
    );

    this.fs.extendJSON(this.destinationPath('package.json'), {
      scripts: {
        test: TEST_SCRIPT,
        'test:watch': TEST_WATCH_SCRIPT,
        'test:cover': TEST_COVER_SCRIPT,
      },
    });

    this.writeDependencies();
  }
}

export default VitestGenerator;
