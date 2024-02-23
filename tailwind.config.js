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
      borderColor: ({ theme }) => ({
        ...theme('colors'),
        DEFAULT: theme('colors.gray.700', 'currentColor'),
      }),
      borderRadius: {
        none: '0',
        xs: '0.1875rem',
        sm: '0.3125rem', //5px
        default: '0.5rem', //8px
        lg: '0.625rem', //10px
        xl: '0.875rem', //14px
      },
      borderWidth: {
        1: '1px',
      },
      fontSize: {
        sm: '0.875rem', //14px
      },
      padding: {
        7.5: '1.875rem',
        9.5: '2.375rem',
        18: '4.5rem',
      },
      space: {
        7.5: '1.875rem',
        9.5: '2.375rem',
      },
      gap: {
        7.5: '1.875rem',
      },
      boxShadow: {
        lv1: '0px 2px 4px 0 rgba(0,0,0,0.5)',
        lv2: '4px 8px 10px 0 rgba(0,0,0,0.3)',
        lv3: '6px 10px 16px 0 rgba(0,0,0,0.25)',
        lv3: '12px 16px 20px 0 rgba(0,0,0,0.2)',
        y: '0px -8px 20px 0 rgba(0,0,0,0.25)',
      },
      gridColumn: {
        'span-14': 'span 14 / span 14',
      },
      gridColumnStart: {
        13: '13',
        14: '14',
      },
      gridColumnEnd: {
        13: '13',
        14: '14',
      },
    },
  },
  plugins: [],
}
