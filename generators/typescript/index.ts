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
  'index.spec.ts.ejs': 'index.spec.ts',
};

const TYPES_BY_TEST_FRAMEWORK: Record<string, string[]> = {
  vitest: ['vitest/globals', 'node'],
  none: ['node'],
};

const typesFor = (testFramework: string | undefined) =>
  TYPES_BY_TEST_FRAMEWORK[testFramework ?? 'mocha'] ?? ['mocha', 'node'];

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
      // No test framework means no test file to write - `index.spec.ts`
      // would otherwise reference a runner that was never installed.
      if (template === 'index.spec.ts.ejs' && testFramework === 'none') {
        return;
      }

      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(destination),
        { projectName: this.appname, testFramework },
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
