import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // ✅ useEffect async warning band
      '@typescript-eslint/no-floating-promises': 'off',
      // ✅ any type warning band
      '@typescript-eslint/no-explicit-any': 'off',
      // ✅ unused eslint-disable warning band
      'no-unused-expressions': 'off',
      // ✅ react hooks exhaustive deps warning band
      'react-hooks/exhaustive-deps': 'off',
      // ✅ no-unsafe warnings band
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
])