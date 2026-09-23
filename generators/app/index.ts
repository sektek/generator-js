import { Composite, DestinationMode, Prompt } from '@sektek/generator';
import BaseAppGenerator from '@sektek/generator-base/generators/app';
import BaseDevcontainerGenerator from '@sektek/generator-base/generators/devcontainer';

import { BaseConfig } from '../../lib/types/base-config.js';
import { BaseFeatures } from '../../lib/types/base-features.js';
import { BaseGenerator } from '../../lib/base-generator.js';
import { BaseOptions } from '../../lib/types/base-options.js';
import { BasePackageGenerator } from '../base-package/index.js';
import { DependenciesGenerator } from '../dependencies/index.js';
import { EslintGenerator } from '../eslint/index.js';
import { GitConfigGenerator } from '../gitconfig/index.js';

const DEFAULT_FEATURES: Partial<BaseFeatures> = {
  unique: true,
};

// Unconditionally composed, regardless of language/testFramework.
// typescript/mocha/vitest are conditional on those options and can't be
// named here (composites() takes no options context) — they stay
// hand-composed in taskInitializing below, same as before this refactor.
const COMPOSITES = [
  { name: '@sektek/base:app', generatorClass: BaseAppGenerator },
  { name: 'gitconfig', generatorClass: GitConfigGenerator },
  {
    name: '@sektek/base:devcontainer',
    generatorClass: BaseDevcontainerGenerator,
  },
  { name: 'base-package', generatorClass: BasePackageGenerator },
  { name: 'eslint', generatorClass: EslintGenerator },
  { name: 'dependencies', generatorClass: DependenciesGenerator },
] satisfies Composite[];

export class AppGenerator extends BaseGenerator<
  BaseConfig,
  BaseOptions,
  BaseFeatures
> {
  static composites(): Composite[] {
    return COMPOSITES;
  }

  static prompts(): Prompt[] {
    return COMPOSITES.flatMap(({ generatorClass }) => generatorClass.prompts());
  }

  static destinationMode(): DestinationMode {
    return { kind: 'newProjectDir' };
  }

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

    // Add dependencies last to preserve user selected versions
    await this.composeWith('dependencies', options, true);
  }
}

export default AppGenerator;
