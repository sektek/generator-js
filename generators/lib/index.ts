import { Composite, DestinationMode } from '@sektek/generator';

import { AppGenerator } from '../app/index.js';
import { BaseConfig } from '../../lib/types/base-config.js';
import { BaseFeatures } from '../../lib/types/base-features.js';
import { BaseGenerator } from '../../lib/base-generator.js';
import { BaseOptions } from '../../lib/types/base-options.js';

const DEFAULT_FEATURES: Partial<BaseFeatures> = {
  unique: true,
};

// A library is an app scaffolded under `libs/<name>`: everything it composes
// (and every prompt it needs) comes from `app`, so only the destination differs.
const COMPOSITES = [
  { name: 'app', generatorClass: AppGenerator },
] satisfies Composite[];

export class LibGenerator extends BaseGenerator<
  BaseConfig,
  BaseOptions,
  BaseFeatures
> {
  static composites(): Composite[] {
    return COMPOSITES;
  }

  static destinationMode(): DestinationMode {
    return { kind: 'newProjectDir', subdir: 'libs' };
  }

  constructor(
    args: string[],
    options: BaseOptions,
    features: BaseFeatures = {} as BaseFeatures,
  ) {
    super(args, options, { ...DEFAULT_FEATURES, ...features });
  }

  async taskInitializing() {
    await this.composeWith('app', this.options, true);
  }
}

export default LibGenerator;
