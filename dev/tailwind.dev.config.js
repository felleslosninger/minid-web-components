/** @type {import("tailwindcss").Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', '../src/**/*.{html,js,ts}'],
  theme: {
    fontFamily: {
      sans: ['inter', 'Arial', 'sans-serif'],
      serif: ['serif'],
    },
  },
};
