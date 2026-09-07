module.exports = {
  import: ['tsx/esm', './test/stub-version-resolver.ts'],
  ui: 'bdd',
  spec: ['**/*.spec.ts'],
  ignore: ['**/node_modules/**'],
};
