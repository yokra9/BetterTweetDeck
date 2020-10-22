module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        enableDangerousAutofixThisMayCauseInfiniteLoops: true,
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/*'],
      env: {
        browser: true,
        node: false,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'react/prop-types': 0,
        'no-unused-vars': 0,
        'react/display-name': 0,
        'simple-import-sort/sort': 2,
        'unused-imports/no-unused-imports-ts': 2,
        'no-use-before-define': 0,
        'no-undef': 0,
        'no-restricted-globals': 0,
      },
    },
  ],
};
