module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-pascal-case': 'error',
    'react/prop-types': 'off',
    'react/no-unused-state': 'error',
    'react/no-typos': 'error',
    'react/no-danger': 'error',
    'react/no-adjacent-inline-elements': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/hook-use-state': 'error',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true
      }
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'import/default': 'off',
    'import/no-mutable-exports': 'error',
    'import/named': 'error',
    'import/first': 'error',
    'import/no-unresolved': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-unassigned-import': [
      'error',
      {
        allow: ['**/*.css', '**/*.scss']
      }
    ],
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-irregular-whitespace': 'error',
    'no-unreachable': 'error',
    'no-unused-vars': 'error',
    'no-use-before-define': 'error',
    'no-empty': 'error',
    'no-empty-function': 'error',
    'no-inline-comments': 'error',
    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'no-var': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'comma-dangle': ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],
    'consistent-return': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'require-await': 'error',
    eqeqeq: 'error',
    strict: ['error', 'global'],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never']
  },
  ignorePatterns: [
    '.*.js',
    'node_modules/',
    'dist',
    '*.config.js',
    'config.js',
    '.next',
    '.turbo'
  ]
}
