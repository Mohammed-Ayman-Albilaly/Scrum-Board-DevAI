/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: '#059669', // emerald-600
            dark: '#14532d',    // emerald-900
          },
          blue: {
            DEFAULT: '#0369a1', // sky-700
            dark: '#1e293b',    // slate-800
          },
          orange: {
            DEFAULT: '#f97316', // orange-500
          },
          neutral: {
            bg: '#f8fafc',      // slate-50
            card: '#f5f5f4',     // stone-100
          }
        },
      },
      borderRadius: {
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
}
