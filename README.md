# @sektek/generator-js

JS/TS project generator for scaffolding new SEKTEK projects, driven by
[`@sektek/gen`](https://github.com/sektek/gen). Layered on top of
[`@sektek/generator-base`](https://github.com/sektek/generator-base).

`BaseGenerator` extends `@sektek/generator`'s `CoreGenerator` directly and sets
`package = '@sektek/js'`; its default options set `packageScope: 'sektek'`, `author`,
`license: 'UNLICENSED'`, `private: true`. Sub-generators:

- `app` — the entrypoint; composes `@sektek/base:app`, `@sektek/base:devcontainer`,
  `base-package`, `gitconfig`, `eslint`, and, when `language: 'typescript'`, `typescript`.
  Also composes a test framework based on `testFramework` (`'mocha'` (default), `'vitest'`,
  or `'none'` to skip test tooling entirely): `mocha` unless `testFramework` is exactly
  `'vitest'` or `'none'`.
- `base-package` — writes `package.json` and, for `language: 'javascript'`, a plain-JS
  entrypoint (no test file — that's the composed test-framework generator's job, not
  `base-package`'s).
- `gitconfig` — composes `@sektek/base:gitconfig`, then layers JS-specific `.gitignore` rules.
- `typescript` — writes `tsconfig.json`/`tsconfig.build.json` (its `compilerOptions.types`
  reflects `testFramework`) and a TS entrypoint (likewise no test file of its own).
- `eslint` — writes `eslint.config.js`, composing `prettier`.
- `prettier` — writes `.prettierrc.js`/`.prettierignore`.
- `mocha` — writes `.mocharc.cjs` (and, for TypeScript, `.mocharc.min.cjs`/`.nycrc.json`) plus
  a chai/BDD-style `index.spec.ts`/`index.spec.js` entrypoint.
- `vitest` — writes `vitest.config.ts` (one config for both JS and TS projects) plus an
  `index.spec.ts`/`index.spec.js` entrypoint using vitest's own `expect` with chai-style
  BDD assertions.
- `workspace` — the root-level, npm-workspaces variant of `app`.

## Installation

```sh
npm install @sektek/generator-js
```
