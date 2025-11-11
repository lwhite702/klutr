/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B2E3F',
        mint: '#00C896',
        coral: '#FF6B6B',
        background: {
          light: '#FFFFFF',
          dark: '#181A25',
          deep: '#202331',
        },
        text: {
          light: '#2B2E3F',
          dark: '#E2E4F0',
        },
      },
    },
  },
  plugins: [],
}

