# @sektek/generator-js

JS/TS project generator for scaffolding new SEKTEK projects, driven by
[`@sektek/gen`](https://github.com/sektek/gen). Layered on top of
[`@sektek/generator-base`](https://github.com/sektek/generator-base).

`BaseGenerator` extends `@sektek/generator`'s `CoreGenerator` directly and sets
`package = '@sektek/js'`; its default options set `packageScope: 'sektek'`, `author`,
`license: 'UNLICENSED'`, `private: true`. Sub-generators:

- `app` — the entrypoint; composes `@sektek/base:app`, `@sektek/base:devcontainer`,
  `base-package`, `gitconfig`, `eslint`, `mocha`, and, when `language: 'typescript'`,
  `typescript`.
- `base-package` — writes `package.json` and, for `language: 'javascript'`, a plain-JS
  entrypoint.
- `gitconfig` — composes `@sektek/base:gitconfig`, then layers JS-specific `.gitignore` rules.
- `typescript` — writes `tsconfig.json`/`tsconfig.build.json` and a TS entrypoint.
- `eslint` — writes `eslint.config.js`, composing `prettier`.
- `prettier` — writes `.prettierrc.js`/`.prettierignore`.
- `mocha` — writes `.mocharc.cjs` (and, for TypeScript, `.mocharc.min.cjs`/`.nycrc.json`).
- `workspace` — the root-level, npm-workspaces variant of `app`.

## Installation

```sh
npm install @sektek/generator-js
```
