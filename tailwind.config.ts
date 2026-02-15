/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      sans: ['Space Grotesk', 'sans-serif'],
    }
  },
  plugins: [],
}
