/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#667eea',
          dark: '#5a6fd8',
          light: '#7c8cff',
          50: '#f0f2ff',
          100: '#e6eaff',
          500: '#667eea',
          600: '#5a6fd8',
          700: '#4f5fc5',
        },
        secondary: {
          DEFAULT: '#764ba2',
          dark: '#6a4190',
          light: '#8b5ab8',
        },
        accent: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399',
        },
        warning: '#f59e0b',
        danger: '#ef4444',
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.15)',
          300: 'rgba(255, 255, 255, 0.2)',
          400: 'rgba(255, 255, 255, 0.25)',
        },
        dark: {
          900: '#0a0a0f',
          800: '#1a1326',
          700: '#2d2e5f',
          600: '#4a4b7c',
          500: '#6b7280',
        },
        glow: {
          purple: 'rgba(102, 126, 234, 0.4)',
          blue: 'rgba(59, 130, 246, 0.4)',
          green: 'rgba(16, 185, 129, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-medium': 'floatMedium 6s ease-in-out infinite',
        'float-fast': 'floatFast 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'gradient-shift': 'gradientShift 20s ease infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' }
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-3deg)' }
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' }
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        gradientShift: {
          '0%': { 'background-position': '0% 50%' },
          '25%': { 'background-position': '100% 50%' },
          '50%': { 'background-position': '100% 100%' },
          '75%': { 'background-position': '0% 100%' },
          '100%': { 'background-position': '0% 50%' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.4)' }
        }
      },
      backgroundSize: {
        '400%': '400% 400%',
      },
      backdropBlur: {
        'ultra': '40px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}