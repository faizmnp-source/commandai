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
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      borderRadius: {
        xl:  '20px',
        '2xl': '28px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(5,150,105,.08), 0 1px 3px rgba(0,0,0,.06)',
        'card-md': '0 4px 20px rgba(5,150,105,.10), 0 2px 6px rgba(0,0,0,.06)',
        'card-lg': '0 12px 40px rgba(5,150,105,.18), 0 4px 12px rgba(0,0,0,.06)',
      },
      animation: {
        'float': 'float 3.2s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'bounce-dot': 'bounceDot 1.2s infinite',
        'fade-up': 'fadeUp .38s ease both',
        'msg-in': 'msgIn .22s ease',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-5px) rotate(1deg)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(74,222,128,.4)' },
          '50%': { opacity: '.7', boxShadow: '0 0 0 4px rgba(74,222,128,0)' },
        },
        bounceDot: {
          '0%,80%,100%': { transform: 'translateY(0)', opacity: '.5' },
          '40%': { transform: 'translateY(-5px)', opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        msgIn: {
          from: { opacity: '0', transform: 'translateY(10px) scale(.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
