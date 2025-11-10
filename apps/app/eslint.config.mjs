import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off", // TypeScript handles this
    },
  },
];
