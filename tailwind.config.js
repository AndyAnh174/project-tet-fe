/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'christmas-red': '#d42426',    // Màu đỏ Giáng sinh
        'christmas-green': '#2F5233',  // Màu xanh Giáng sinh
      },
      fontFamily: {
        'christmas': ['Mountains of Christmas', 'cursive'],  // Font chữ Giáng sinh
        'dancing': ['"Dancing Script"', 'cursive'],
        pacifico: ['Pacifico', 'cursive'],
        lobster: ['Lobster', 'cursive'],
        greatVibes: ['Great Vibes', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
