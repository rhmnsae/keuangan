/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#151515', paper: '#fff7e8', paper2: '#ffe9bd', lime: '#c6ff00',
        pink: '#ff5ca8', cyan: '#00e5ff', purple: '#8b5cf6', orange: '#ff9f1c',
        green: '#28e98c', red: '#ff4d4d', blue: '#4da3ff', muted: '#5e5147'
      },
      fontFamily: { pixel: ['System'], sans: ['System'] }
    }
  },
  plugins: []
};
