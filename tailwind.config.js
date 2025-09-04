/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EFEEFF',
          100: '#E0DEFF',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          500: '#7C3AED',
          600: '#6D28D9',
        },
        accent: {
          DEFAULT: '#EC4899',
          500: '#EC4899',
          600: '#DB2777',
        },
        surface: '#F8FAFC',
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}