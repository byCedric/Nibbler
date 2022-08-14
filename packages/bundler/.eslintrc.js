/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: 'universe/node',
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['node_modules', 'build', '**/*/__tests__/fixtures'],
};
