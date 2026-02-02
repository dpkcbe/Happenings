/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#050511', // Deep Midnight
        surface: '#121223',    // Elevated Midnight
        'surface-highlight': '#1E1E3F',
        primary: '#C084FC',    // Purple 400
        secondary: '#F472B6',  // Pink 400
        'text-primary': '#F8FAFC',   // Slate 50
        'text-secondary': '#94A3B8', // Slate 400
        success: '#4ADE80',
        error: '#F87171',
        warning: '#FBBF24',
      },
      fontFamily: {
        sans: ['Outfit_400Regular'],
        medium: ['Outfit_500Medium'],
        bold: ['Outfit_700Bold'],
      },
    },
  },
  plugins: [],
}
