import '../base-package/index.js';
import '../dependencies/index.js';
import '../gitconfig/index.js';
import '../typescript/index.js';
import '../eslint/index.js';
import '../mocha/index.js';
import '../vitest/index.js';

import { BaseConfig } from '../../lib/types/base-config.js';
import { BaseFeatures } from '../../lib/types/base-features.js';
import { BaseGenerator } from '../../lib/base-generator.js';
import { BaseOptions } from '../../lib/types/base-options.js';

const DEFAULT_FEATURES: Partial<BaseFeatures> = {
  unique: true,
};

export class AppGenerator extends BaseGenerator<
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

  async taskInitializing() {
    const { options } = this;
    const { language, testFramework } = options;

    await this.composeWith('@sektek/base:app', options, true);
    await this.composeWith('gitconfig', options, true);
    await this.composeWith('@sektek/base:devcontainer', options, true);
    await this.composeWith('base-package', options, true);

    if (language === 'typescript') {
      await this.composeWith('typescript', options, true);
    }

    await this.composeWith('eslint', options, true);

    if (testFramework === 'vitest') {
      await this.composeWith('vitest', options, true);
    } else if (testFramework !== 'none') {
      // Covers 'mocha' and the undefined/unset default alike.
      await this.composeWith('mocha', options, true);
    }

    // Compose last: every sub-generator's writeDependencies() extendJSON-merges
    // into package.json on the shared 'writing' queue, last write wins for a
    // given key, so caller-pinned dependencies/devDependencies must be
    // composed after every other dependency-writing sub-generator to take
    // precedence over the versions they resolve for overlapping package names.
    await this.composeWith('dependencies', options, true);
  }
}

export default AppGenerator;
