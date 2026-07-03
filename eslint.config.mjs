// eslint.config.js
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: [
      'src/**/*.ts'
    ],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/block-spacing': ['error', 'never']
    }
  }
];
