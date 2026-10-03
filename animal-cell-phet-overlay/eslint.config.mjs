import simEslintConfig from '../perennial-alias/js/eslint/config/sim.eslint.config.mjs';

export default [
  ...simEslintConfig,
  {
    files: [
      'js/gene-expression-essentials-main.js',
      'js/animal-cell/**/*.js'
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2015,
        sourceType: 'module'
      }
    }
  }
];
