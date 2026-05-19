/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
      },
      colors: {
        em: {
          50:  '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0',
          300: '#6ee7b7', 400: '#34d399', 500: '#10b981',
          600: '#059669', 700: '#047857', 800: '#065f46',
        },
        brand: {
          950: '#060810',
          900: '#0a0f1e',
          800: '#0f1629',
          700: '#141e38',
          600: '#1b2849',
          500: '#233261',
        },
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.06)',
        'card-md': '0 2px 8px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08)',
        'card-lg': '0 4px 12px rgba(0,0,0,.08), 0 16px 40px rgba(0,0,0,.12)',
        'glow-em': '0 0 24px rgba(16,185,129,.25)',
        'glow-sm': '0 0 12px rgba(16,185,129,.18)',
      },
      animation: {
        'float':      'float 3.2s ease-in-out infinite',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'bounce-dot': 'bounceDot 1.2s infinite',
        'fade-up':    'fadeUp .32s cubic-bezier(.16,1,.3,1) both',
        'msg-in':     'msgIn .22s ease',
        'shimmer':    'shimmer 2.2s linear infinite',
        'slide-up':   'slideUp .4s cubic-bezier(.16,1,.3,1) both',
      },
      keyframes: {
        float:     { '0%,100%': { transform: 'translateY(0)' },    '50%': { transform: 'translateY(-5px)' } },
        pulseDot:  { '0%,100%': { opacity: '1' },                  '50%': { opacity: '.5' } },
        bounceDot: { '0%,80%,100%': { transform: 'translateY(0)', opacity: '.5' }, '40%': { transform: 'translateY(-5px)', opacity: '1' } },
        fadeUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        msgIn:     { from: { opacity: '0', transform: 'translateY(10px) scale(.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
