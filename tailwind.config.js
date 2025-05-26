/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        secondary: '#FF7D00',
        success: '#00B42A',
        warning: '#FF7D00',
        danger: '#F53F3F',
        dark: '#1D2129',
        'gray-100': '#F2F3F5',
        'gray-200': '#E5E6EB',
        'gray-300': '#C9CDD4',
        'gray-400': '#86909C',
        'gray-500': '#4E5969',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
} 