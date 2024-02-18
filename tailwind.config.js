/** @type {import('tailwindcss').Config} */
module.exports = {
  // purge: {
  //   enabled: true,
  //   content: ["./**/*.html"],
  // },
  // darkMode: false, // or 'media' or 'class'
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
        sm: '0.25rem',
        default: '0.3125rem',
        lg: '0.375rem',
        xl: '0.4375rem',
        '2xl': '0.4791666865348816rem',
        '3xl': '0.625rem',
        '4xl': '0.75rem',
        '5xl': '1rem',
        '6xl': '1.25rem',
        '7xl': '1.75rem',
        '8xl': '1.875rem',
        '9xl': '2.3125rem',
        full: '9999px',
      },
      fontSize: {
        sm: '0.875rem', //14px
      },
    },
  },
  plugins: [],
}
