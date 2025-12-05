/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: '#FF3B30',
        orange: '#FF9500',
        cream: '#FFF8F0',
        dark: '#2C2C2C',
        gray: '#8E8E93',
        'light-gray': '#F2F2F7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Fredoka', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}