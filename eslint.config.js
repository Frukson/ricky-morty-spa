// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      '@typescript-eslint/no-unnecessary-optional-chaining': [
        'error',
        {
          checkAnyNullishType: false,
        },
      ],
    },
  },
]
