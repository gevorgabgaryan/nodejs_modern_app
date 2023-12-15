module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'n/exports-style': ['error', 'module.exports'],
    'n/no-deprecated-api': 'error',
    'n/prefer-promises/fs': 'error',
    'n/no-sync': 'error'
  }
}
