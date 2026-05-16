
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern futuristic palette
        obsidian:        '#0A0A0A',
        charcoal:        '#161616',
        'charcoal-light':'#1E1E1E',
        smoke:           '#2A2A2A',
        ash:             '#6B6B6B',
        silver:          '#9A9A9A',
        cream:           '#F5F5F3',
        ivory:           '#F5F0E8',
        // Primary accent — brand lime green
        gold:            '#B7FF00',
        lime:            '#B7FF00',
        teal:            '#3A9090',
        // Semantic aliases — keep for admin panel compatibility
        background: '#0A0A0A',
        surface:    '#161616',
        primary: {
          DEFAULT:    '#B7FF00',
          foreground: '#0A0A0A',
        },
        secondary: {
          DEFAULT:    '#B7FF00',
          foreground: '#0A0A0A',
        },
        accent: {
          DEFAULT: '#3A9090',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
        serif:   ['Satoshi', 'system-ui', 'sans-serif'],
        sans:    ['Satoshi', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(5rem,11vw,12rem)',       { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        'display-xl':  ['clamp(3.5rem,7vw,8rem)',        { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-lg':  ['clamp(2.5rem,5vw,5.5rem)',      { lineHeight: '0.96', letterSpacing: '-0.025em' }],
        'display-md':  ['clamp(1.75rem,3.5vw,3.5rem)',   { lineHeight: '1.0',  letterSpacing: '-0.02em' }],
      },
      animation: {
        'slow-drift': 'slowDrift 18s ease-in-out infinite',
        'fade-up':    'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        // Preserved for admin panel
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slowDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(30px, -20px) scale(1.04)' },
          '66%':      { transform: 'translate(-20px, 15px) scale(0.97)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        // Preserved for admin panel
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), 0 0 10px rgba(139, 92, 246, 0.4)' },
        },
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
