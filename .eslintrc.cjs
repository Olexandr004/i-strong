module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'next/core-web-vitals',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort', 'react'],
  rules: {
    // console
    'no-console': 'warn',
    // typescript
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    // import
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^next', '^@?\\w'],
          ['^next', '^./?\\w'],
          ['^react', '^./?\\w'],
          ['^react', '^@?\\w'],
          ['^(@|modules)(/.*|$)'],
          ['^\\u0000'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ['^.+\\.?(css)$'],
        ],
      },
    ],
    // react
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-hooks/exhaustive-deps': 'off',
  },
  env: {
    browser: true,
    node: true,
  },
};
