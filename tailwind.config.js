
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Luxury editorial palette
        obsidian:        '#0a0a0a',
        charcoal:        '#141414',
        'charcoal-light':'#1e1e1e',
        smoke:           '#2a2a2a',
        ash:             '#6b6b6b',
        silver:          '#a0a0a0',
        cream:           '#f4efe6',
        ivory:           '#faf8f0',
        gold:            '#c8a45a',
        lime:            '#b8d34a',
        teal:            '#3a9090',
        // Semantic aliases — keep for admin panel compatibility
        background: '#0a0a0a',
        surface:    '#141414',
        primary: {
          DEFAULT:    '#c8a45a',
          foreground: '#0a0a0a',
        },
        secondary: {
          DEFAULT:    '#b8d34a',
          foreground: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#3a9090',
        },
      },
      fontFamily: {
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(5rem,11vw,12rem)',  { lineHeight: '0.9',  letterSpacing: '-0.03em' }],
        'display-xl':  ['clamp(3.5rem,7vw,8rem)',   { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-lg':  ['clamp(2.5rem,5vw,5.5rem)', { lineHeight: '1.0',  letterSpacing: '-0.02em' }],
        'display-md':  ['clamp(1.75rem,3.5vw,3.5rem)', { lineHeight: '1.05' }],
      },
      animation: {
        'slow-drift':  'slowDrift 18s ease-in-out infinite',
        'fade-up':     'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        // Preserved for admin panel
        'float':       'float 6s ease-in-out infinite',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
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
