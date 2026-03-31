/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary / blue palette (aligned to requested theme)
        blue: {
          50: '#eff6ff', // light accent
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb', // primary
          700: '#1d4ed8', // primary hover
        },
        // Provide a `primary` alias for any existing usages
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Map gray -> slate family to ensure bg / border / text consistency
        gray: {
          50: '#f8fafc',  // background
          100: '#f1f5f9',
          200: '#e2e8f0',  // borders
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',  // secondary text
          600: '#475569',
          700: '#334155',
          800: '#1e293b',  // primary text
          900: '#0f172a',
        },
        // Keep red/green for status semantics; remap decorative palettes to neutral/primary
        purple: {
          50: '#eff6ff',
          100: '#eff6ff',
          600: '#2563eb'
        },
        pink: {
          50: '#eff6ff',
          100: '#eff6ff',
          600: '#2563eb'
        },
        indigo: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb'
        },
        orange: {
          50: '#fff7ed',
          100: '#fff7ed',
          600: '#f97316'
        },
        teal: {
          50: '#ecfeff',
          100: '#ecfeff',
          600: '#14b8a6'
        },
        yellow: {
          50: '#fffbeb',
          100: '#fffbeb',
          600: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
}
