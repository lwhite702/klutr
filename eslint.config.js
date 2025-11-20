import nextPlugin from "@next/eslint-plugin-next"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import globals from "globals"

export default [
  {
    ignores: ["**/.next/**", "node_modules/**", "**/dist/**"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...nextPlugin.configs.recommended.rules,
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]
