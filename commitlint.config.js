export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'kernel',
      'api',
      'web',
      'admin',
      'config',
      'types',
      'validators',
      'database',
      'infra',
      'docs',
      'root',
    ]],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
  },
};
