/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#151515', paper: '#fff7e8', paper2: '#ffe9bd', lime: '#c6ff00',
        pink: '#ff5ca8', cyan: '#00e5ff', purple: '#8b5cf6', orange: '#ff9f1c',
        green: '#28e98c', red: '#ff4d4d', blue: '#4da3ff', muted: '#5e5147'
      },
      boxShadow: {
        brutal: '7px 7px 0 #151515',
        brutalSm: '4px 4px 0 #151515',
        brutalLg: '12px 12px 0 #151515'
      },
      fontFamily: {
        pixel: ['Pixelify Sans', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
