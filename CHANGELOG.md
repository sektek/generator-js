# Changelog

## [0.17.5](https://github.com/sektek/generator-js/compare/v0.17.4...v0.17.5) (2026-10-24)

### Bug Fixes

* **generator-js:** workspace accepts --dependency and --dev-dependency but never applies them ([#31](https://github.com/sektek/generator-js/issues/31)) ([e2c3128](https://github.com/sektek/generator-js/commit/e2c3128aa34dbb7bc56b3d3e97baf2d9948ea6a2))

## [0.17.4](https://github.com/sektek/generator-js/compare/v0.17.3...v0.17.4) (2026-10-24)

### Bug Fixes

* **generator-js:** workspace --license writes the license into package.json but no LICENSE file ([#32](https://github.com/sektek/generator-js/issues/32)) ([6876cd7](https://github.com/sektek/generator-js/commit/6876cd73b068a8940bcba24064c3d3984d34f680))

## [0.17.3](https://github.com/sektek/generator-js/compare/v0.17.2...v0.17.3) (2026-10-24)

### Bug Fixes

* **generator-js:** workspace reads author but declares no author prompt ([#30](https://github.com/sektek/generator-js/issues/30)) ([47d9bb7](https://github.com/sektek/generator-js/commit/47d9bb75712532c189b714c3f725f2d974dbdc65))

## [0.17.2](https://github.com/sektek/generator-js/compare/v0.17.1...v0.17.2) (2026-10-18)

### Bug Fixes

* **generator-js:** bump @sektek/generator-base to the release where workspace composes its prompts ([#29](https://github.com/sektek/generator-js/issues/29)) ([7e17001](https://github.com/sektek/generator-js/commit/7e170016f875fd2afd52fe4e5696d36960421e2d))

## [0.17.1](https://github.com/sektek/generator-js/compare/v0.17.0...v0.17.1) (2026-10-18)

### Bug Fixes

* **generator-js:** bump @sektek/generator-base to the release with the projectName prompts ([#28](https://github.com/sektek/generator-js/issues/28)) ([49b85ca](https://github.com/sektek/generator-js/commit/49b85ca7a31431796abad3147e28418245bac17c))

## [0.17.0](https://github.com/sektek/generator-js/compare/v0.16.0...v0.17.0) (2026-10-18)

### Features

* **generator-js:** leaf generators declare the prompts they read ([#26](https://github.com/sektek/generator-js/issues/26)) ([47501d0](https://github.com/sektek/generator-js/commit/47501d07fd366a151f902fdbe2c2fbcd706673ab))
* **generator-js:** lib composes js:app and inherits its prompts ([#25](https://github.com/sektek/generator-js/issues/25)) ([b7aef67](https://github.com/sektek/generator-js/commit/b7aef6793c9b80749aaee66c6a68ef0df780f0d4))

## [0.16.0](https://github.com/sektek/generator-js/compare/v0.15.1...v0.16.0) (2026-10-17)

### Features

* **generator-js:** app declares language, testFramework and dependency prompts ([#24](https://github.com/sektek/generator-js/issues/24)) ([e944f79](https://github.com/sektek/generator-js/commit/e944f79825aa4e9f52e38d1d3e98f8ba5b728e98))

## [0.15.1](https://github.com/sektek/generator-js/compare/v0.15.0...v0.15.1) (2026-10-17)

### Bug Fixes

* **generator-js:** bump @sektek/generator-base to the release with the new prompts ([#23](https://github.com/sektek/generator-js/issues/23)) ([f8c1e17](https://github.com/sektek/generator-js/commit/f8c1e178358f53622c5bf850cb5bb75b6b4e910b))

## [0.15.0](https://github.com/sektek/generator-js/compare/v0.14.0...v0.15.0) (2026-10-17)

### Features

* **generator-js:** base-package declares the prompts it reads ([#21](https://github.com/sektek/generator-js/issues/21)) ([27cfff7](https://github.com/sektek/generator-js/commit/27cfff737b7a3600c78c5b112f8814bf08b7727d))

## [0.14.0](https://github.com/sektek/generator-js/compare/v0.13.0...v0.14.0) (2026-10-17)

### Features

* **generator-js:** workspace declares language, license, private and dependency prompts ([#22](https://github.com/sektek/generator-js/issues/22)) ([d6fc05b](https://github.com/sektek/generator-js/commit/d6fc05b819573a6ca0b3a09285137923bc434f2e))

## [0.13.0](https://github.com/sektek/generator-js/compare/v0.12.1...v0.13.0) (2026-10-11)

### Features

* **generator-js:** shared languagePrompt ([#19](https://github.com/sektek/generator-js/issues/19)) ([ae7158c](https://github.com/sektek/generator-js/commit/ae7158ce6b9e8142f2954702bb4fcdd7686700bd))
* **generator-js:** shared testFrameworkPrompt ([#20](https://github.com/sektek/generator-js/issues/20)) ([b43a32e](https://github.com/sektek/generator-js/commit/b43a32ed1945fa3c57b7321ff863207d534e65bb))

## [0.12.1](https://github.com/sektek/generator-js/compare/v0.12.0...v0.12.1) (2026-10-11)

### Bug Fixes

* **generator-js:** bump @sektek/generator and @sektek/generator-base to the releases with the new prompts ([#18](https://github.com/sektek/generator-js/issues/18)) ([b2e2f40](https://github.com/sektek/generator-js/commit/b2e2f40ffccec54185a8a21f969a57875dacd413))

## [0.12.0](https://github.com/sektek/generator-js/compare/v0.11.0...v0.12.0) (2026-10-11)

### Features

* **generator-js:** packageScopePrompt derives the default npm scope ([#17](https://github.com/sektek/generator-js/issues/17)) ([ad8f95d](https://github.com/sektek/generator-js/commit/ad8f95d1dd9d7f10626b2ba091bcecf1b77b6286))

## [0.11.0](https://github.com/sektek/generator-js/compare/v0.10.0...v0.11.0) (2026-10-11)

### Features

* **generator-js:** shared privatePrompt gated off for UNLICENSED ([#15](https://github.com/sektek/generator-js/issues/15)) ([4a0559d](https://github.com/sektek/generator-js/commit/4a0559d5f7310c8b53136aed3ec86a3c3a8232a0))

## [0.10.0](https://github.com/sektek/generator-js/compare/v0.9.0...v0.10.0) (2026-10-10)

### Features

* **generator-js:** dependencies and devDependencies list prompts ([#16](https://github.com/sektek/generator-js/issues/16)) ([e355f24](https://github.com/sektek/generator-js/commit/e355f245df556d8f687f7fae07b7ac3adbbd899b))

## [0.9.0](https://github.com/sektek/generator-js/compare/v0.8.1...v0.9.0) (2026-09-24)

### Features

* **generator-js:** js:lib generator (destinationMode newProjectDir, subdir 'libs') ([#14](https://github.com/sektek/generator-js/issues/14)) ([d551e4e](https://github.com/sektek/generator-js/commit/d551e4eb29ddb5681a76511ed32a6d078630b15d))

## [0.8.1](https://github.com/sektek/generator-js/compare/v0.8.0...v0.8.1) (2026-09-23)

### Bug Fixes

* **generator-js): app/workspace declare real composites() + destinationMode(:** newProjectDir ([#13](https://github.com/sektek/generator-js/issues/13)) ([8d5cd2f](https://github.com/sektek/generator-js/commit/8d5cd2f7d4f932bd73c8ce8fdb4b4d54d2e102b1))

## [0.8.0](https://github.com/sektek/generator-js/compare/v0.7.0...v0.8.0) (2026-09-19)

### Features

* **generator-js:** base-package consumes shared authorPrompt ([#12](https://github.com/sektek/generator-js/issues/12)) ([cfce661](https://github.com/sektek/generator-js/commit/cfce661153cde2e0fe592327244ce8f2c3582fba))

## [0.7.0](https://github.com/sektek/generator-js/compare/v0.6.1...v0.7.0) (2026-09-13)

### Features

* **generator-js:** remove redundant hardcoded author default (SEK-92) ([#11](https://github.com/sektek/generator-js/issues/11)) ([6de1daa](https://github.com/sektek/generator-js/commit/6de1daa7f614fafad57b99898033aebd183e2863))

## [0.6.1](https://github.com/sektek/generator-js/compare/v0.6.0...v0.6.1) (2026-09-13)

### Bug Fixes

* **generator-js:** default resolved dependency versions to a caret range ([#10](https://github.com/sektek/generator-js/issues/10)) ([cfccc86](https://github.com/sektek/generator-js/commit/cfccc864514bf0c02b81805280249a6fb4a4448b))

## [0.6.0](https://github.com/sektek/generator-js/compare/v0.5.0...v0.6.0) (2026-09-07)

### Features

* allow a provided list of dependencies for JS/TS projects ([#9](https://github.com/sektek/generator-js/issues/9)) ([2d24d75](https://github.com/sektek/generator-js/commit/2d24d75c29fc2946ca28b3011bac352d5e176b74))

## [0.5.0](https://github.com/sektek/generator-js/compare/v0.4.0...v0.5.0) (2026-09-05)

### Features

* **generator-js:** wire testFramework into AppGenerator ([#6](https://github.com/sektek/generator-js/issues/6)) ([d21245d](https://github.com/sektek/generator-js/commit/d21245da2f3cb780840ded52998904bc0c58c547)), closes [sektek/generator-js#5](https://github.com/sektek/generator-js/issues/5)

## [0.4.0](https://github.com/sektek/generator-js/compare/v0.3.0...v0.4.0) (2026-09-04)

### Features

* **generator-js:** add VitestGenerator sub-generator ([#5](https://github.com/sektek/generator-js/issues/5)) ([a1c3ec0](https://github.com/sektek/generator-js/commit/a1c3ec0ddbc761bfdfbb2642b330b32258fe2762))

## [0.3.0](https://github.com/sektek/generator-js/compare/v0.2.1...v0.3.0) (2026-09-04)

### Features

* **generator-js:** add testFramework field to BaseOptions ([#4](https://github.com/sektek/generator-js/issues/4)) ([1826f83](https://github.com/sektek/generator-js/commit/1826f838b2c182eb442961438ca23be42297bf71))

## [0.2.1](https://github.com/sektek/generator-js/compare/v0.2.0...v0.2.1) (2026-09-02)

### Bug Fixes

* **deps:** bump @sektek/generator-base to ^0.5.0 ([#3](https://github.com/sektek/generator-js/issues/3)) ([b2e5f02](https://github.com/sektek/generator-js/commit/b2e5f0243ba8f65cb1349838d596b8f030a0e202))

## [0.2.0](https://github.com/sektek/generator-js/compare/v0.1.0...v0.2.0) (2026-08-30)

### Features

* **app:** register git/github sub-generators in app spec, guard gitInit ([#2](https://github.com/sektek/generator-js/issues/2)) ([fa268f9](https://github.com/sektek/generator-js/commit/fa268f9cbe22274a4cf95facd831e615a28ab820)), closes [generator-base#7](https://github.com/sektek/generator-base/issues/7)

## 0.1.0 (2026-08-23)

### Features

* extract @sektek/generator-js from workspace-generator ([a293b1c](https://github.com/sektek/generator-js/commit/a293b1ca53e46aeb952d9486638eb83fa11801f9))
