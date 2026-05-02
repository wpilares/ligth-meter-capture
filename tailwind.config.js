/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: {
            primary: '#0a0a0a',
            secondary: '#0d0b14',
            tertiary: '#141020',
            card: '#111111',
          },
          accent: {
            primary: '#a855f7',
            secondary: '#9333ea',
            hover: '#c084fc',
          },
          text: {
            primary: '#f5f5f5',
            secondary: '#a1a1aa',
            muted: '#71717a',
          },
          border: '#27272a',
        },
        light: {
          bg: {
            primary: '#ffffff',
            secondary: '#f8f5ff',
            tertiary: '#f0ebff',
            card: '#f9fafb',
          },
          accent: {
            primary: '#9333ea',
            secondary: '#7e22ce',
            hover: '#a855f7',
          },
          text: {
            primary: '#18181b',
            secondary: '#52525b',
            muted: '#a1a1aa',
          },
          border: '#e4e4e7',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}
