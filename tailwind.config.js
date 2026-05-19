/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        em: {
          50:  '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0',
          300: '#6ee7b7', 400: '#34d399', 500: '#10b981',
          600: '#059669', 700: '#047857', 800: '#065f46',
        },
      },
      animation: {
        'float':      'float 3.2s ease-in-out infinite',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'bounce-dot': 'bounceDot 1.2s infinite',
        'fade-up':    'fadeUp .38s ease both',
        'msg-in':     'msgIn .22s ease',
      },
      keyframes: {
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
        pulseDot:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '.6' } },
        bounceDot: { '0%,80%,100%': { transform: 'translateY(0)', opacity: '.5' }, '40%': { transform: 'translateY(-5px)', opacity: '1' } },
        fadeUp:    { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        msgIn:     { from: { opacity: '0', transform: 'translateY(10px) scale(.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
    },
  },
  plugins: [],
}