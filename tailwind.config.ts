import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  variants: {
    extend: {
      display: ['responsive'],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        primary: '#f5e7d5',
        whiteAlpha: {
          50: '#0c182105',
          100: '#FFFFFF0F',
          300: '#FFFFFF29',
          500: '#FFFFFF5C',
          600: '#FFD0AC',
          1000: '#FFFFFF',
        },
        brandBlue: {
          100: '#81DFE4',
          200: '#15BBC6',
        },
        gray: {
          300: '#999999',
          400: '#676767',
          500: '#3C4150',
          600: '#303544',
          650: '#30354480',
          700: '#272C39',
          900: '#222631',
        },
        orange: '#FF9900',
        red: '#B50A0A',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
