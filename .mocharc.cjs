module.exports = {
  import: 'tsx/esm',
  ui: 'bdd',
  spec: ['**/*.spec.ts'],
  ignore: ['**/node_modules/**'],
  require: ['./test/stub-version-resolver.ts'],
};
