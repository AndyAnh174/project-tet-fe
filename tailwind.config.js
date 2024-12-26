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
        'be-vietnam': ['"Be Vietnam Pro"', 'sans-serif'],
        'lexend': ['Lexend', 'sans-serif'],
      },
      animation: {
        'title': 'slideUp 0.8s ease-out 0.2s forwards',
        'description': 'slideUp 0.8s ease-out 0.4s forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
