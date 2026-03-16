
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        background: "#030712", // deep tech blue/black
        surface: "#0f172a", // slate-900
        primary: {
          DEFAULT: "#06b6d4", // cyan-500
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // violet-500
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#00d4ff", // electric cyan
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), 0 0 10px rgba(139, 92, 246, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
