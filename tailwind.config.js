/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Noto Sans TC', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        gray: {
          default: '#57534E',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        orange: {
          default: '#E2791C',
          500: '#E2791C',
          600: '#C1610C',
        },
        rose: {
          default: '#E11D48',
          600: '#E11D48',
        },
        lightblue: {
          default: '#0284C7',
          600: '#0284C7',
        },
        emerald: {
          default: '#10B981',
          500: '#10B981',
          600: '#059669',
        },
      },
      textColor: ({ theme }) => theme('colors'),
      // 覆蓋預設的背景顏色
      backgroundColor: ({ theme }) => theme('colors'),
      borderRadius: {
        none: '0',
        xs: '0.1875rem',
        sm: '0.625rem',
        default: '1rem',
        lg: '1.25rem',
        xl: '1.75rem',
      },
      fontSize: {
        sm: '0.875rem', //14px
      },
    },
  },
  plugins: [],
}
