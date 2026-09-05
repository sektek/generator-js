import { BaseConfig } from '../../lib/types/base-config.js';
import { BaseFeatures } from '../../lib/types/base-features.js';
import { BaseGenerator } from '../../lib/base-generator.js';
import { BaseOptions } from '../../lib/types/base-options.js';

const DEFAULT_FEATURES: Partial<BaseFeatures> = {
  unique: true,
};

export const BUILD_SCRIPT = 'npx tsc -p tsconfig.build.json';

const CONFIG_TEMPLATES = {
  'tsconfig.json.ejs': 'tsconfig.json',
  'tsconfig.build.json.ejs': 'tsconfig.build.json',
};

const ENTRYPOINT_TEMPLATES = {
  'index.ts.ejs': 'index.ts',
};

// Only mocha needs an ambient global type package: our vitest.config.ts
// template never sets `test.globals: true`, and the generated spec imports
// describe/it/expect explicitly - so `vitest/globals` would be actively
// wrong here (it declares those as real ambient globals via `declare
// global`, which type-checks a bare, unimported `describe(...)` call fine
// and then throws `ReferenceError` at runtime, since nothing actually
// defines it without globals enabled). No vitest-specific types entry is
// needed for explicit imports to type-check.
const typesFor = (testFramework: string | undefined) =>
  (testFramework ?? 'mocha') === 'mocha' ? ['mocha', 'node'] : ['node'];

export class TypescriptGenerator extends BaseGenerator<
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
    await this.addDependency('tslib');
    await this.addDevDependency('typescript');
    await this.addDevDependency('@types/node');
  }

  taskWriting() {
    const { testFramework } = this.options;
    const types = typesFor(testFramework);

    Object.entries(CONFIG_TEMPLATES).forEach(([template, destination]) => {
      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(destination),
        { types },
      );
    });

    Object.entries(ENTRYPOINT_TEMPLATES).forEach(([template, destination]) => {
      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(destination),
        {},
      );
    });

    this.fs.extendJSON(this.destinationPath('package.json'), {
      scripts: {
        build: BUILD_SCRIPT,
      },
    });

    this.writeDependencies();
  }
}

export default TypescriptGenerator;
