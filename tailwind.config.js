/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: '#141414',
        secondary: '#000000',
        canvas: '#070B14',
        band: '#0E1611',
        surface: {
          DEFAULT: '#15201A',
          raised: '#1D2B23',
        },
        line: {
          DEFAULT: '#2A3A30',
          strong: '#3A4F42',
          control: '#667E70',
        },
        fg: {
          DEFAULT: '#EEF3E6',
          secondary: '#9DB0A2',
        },
        action: {
          DEFAULT: '#4FDB86',
          hover: '#6BE199',
          pressed: '#2BD46D',
          tintBg: '#162C1F',
          tintLine: '#2E5C40',
          tintFg: '#95E4B4',
        },
        extension: {
          DEFAULT: '#E8C96A',
          hover: '#EBCF7A',
          pressed: '#E2C05B',
          tintBg: '#322B15',
          tintLine: '#5F5125',
          tintFg: '#EDD58C',
        },
        danger: '#F28B82',
      },
      borderRadius: {
        'card': '1.25rem',
        'panel': '1.75rem',
        'full': '9999px',
      },
      letterSpacing: {
        'tight-title': '-0.04em',
        'tight-h2': '-0.02em',
        'tight-brand': '-0.03em',
      },
      spacing: {
        'phi-2xs': '0.375rem',
        'phi-xs': '0.625rem',
        'phi-sm': '1rem',
        'phi-md': '1.625rem',
        'phi-lg': '2.625rem',
        'phi-xl': '4.25rem',
        'phi-2xl': '6.875rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-100%, 0, 0)' },
        },
      },
      animation: {
        marquee: 'marquee 55s linear infinite',
      },
    },
    container: {
      center: true,
      padding: '5px',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
