import { Prompt, authorPrompt, descriptionPrompt } from '@sektek/generator';
import { licensePrompt } from '@sektek/generator-base';

import {
  dependenciesPrompt,
  devDependenciesPrompt,
  languagePrompt,
  packageScopePrompt,
  privatePrompt,
} from '../../lib/prompts/index.js';
import { BaseConfig } from '../../lib/types/base-config.js';
import { BaseFeatures } from '../../lib/types/base-features.js';
import { BaseGenerator } from '../../lib/base-generator.js';
import { BaseOptions } from '../../lib/types/base-options.js';

const DEFAULT_FEATURES: Partial<BaseFeatures> = {
  unique: true,
};

const ENTRYPOINT_TEMPLATES = {
  'index.js.ejs': 'index.js',
};

export class BasePackageGenerator extends BaseGenerator<
  BaseConfig,
  BaseOptions,
  BaseFeatures
> {
  static prompts(): Prompt[] {
    return [
      descriptionPrompt,
      languagePrompt,
      authorPrompt,
      licensePrompt,
      privatePrompt,
      packageScopePrompt,
      dependenciesPrompt,
      devDependenciesPrompt,
    ];
  }

  constructor(
    args: string[],
    options: BaseOptions,
    features: BaseFeatures = {} as BaseFeatures,
  ) {
    super(args, options, { ...DEFAULT_FEATURES, ...features });
  }

  taskWriting() {
    const { language, author, license, private: isPrivate } = this.options;

    this.fs.copyTpl(
      this.templatePath('package.json.ejs'),
      this.destinationPath('package.json'),
      {
        packageName: this.packageName,
        projectSlug: this.projectSlug,
        projectDescription: this.description,
        entryPoint: language === 'typescript' ? 'dist/index.js' : 'index.js',
        license,
        privatePackage: isPrivate,
        author,
      },
    );

    if (language !== 'typescript') {
      Object.entries(ENTRYPOINT_TEMPLATES).forEach(
        ([template, destination]) => {
          this.fs.copyTpl(
            this.templatePath(template),
            this.destinationPath(destination),
            {},
          );
        },
      );
    }
  }

  get packageName() {
    const scope = this.options.packageScope?.replace(/^@/, '');
    const prefix = scope ? `@${scope}/` : '';
    return `${prefix}${this.projectSlug}`;
  }
}

export default BasePackageGenerator;
