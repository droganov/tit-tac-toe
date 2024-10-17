import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import loguxTsConfig from '@logux/eslint-config/ts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default fixupConfigRules([
  ...loguxTsConfig,
  ...ts.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.ts?(x)'],
    ignores: [],
  },
  {
    rules: {
      'import/extensions': 'off',
      'prefer-const': 'error',
      'prefer-let/prefer-let': 'off',
    },
  },
])
