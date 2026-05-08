/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base dark palette
        surface: {
          DEFAULT: '#0a0a0f',
          1: '#0f0f18',
          2: '#14141f',
          3: '#1a1a28',
          4: '#202032',
        },
        // Brand accent — deep Macedonian red/crimson
        accent: {
          DEFAULT: '#c0392b',
          light: '#e74c3c',
          muted: '#7d2419',
          subtle: '#2a0e0a',
        },
        // Gold accent for trust/tier indicators
        gold: {
          DEFAULT: '#d4a843',
          light: '#f0c060',
          muted: '#8a6a20',
          subtle: '#1e1608',
        },
        // Text hierarchy
        ink: {
          DEFAULT: '#f0f0f5',
          muted: '#9898b0',
          faint: '#4a4a60',
        },
        // Borders
        border: {
          DEFAULT: '#1e1e2e',
          muted: '#14141f',
          accent: '#c0392b33',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        display: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-surface':
          'linear-gradient(135deg, #0f0f18 0%, #0a0a0f 100%)',
      },
      boxShadow: {
        'glow-accent': '0 0 24px rgba(192, 57, 43, 0.15)',
        'glow-gold': '0 0 24px rgba(212, 168, 67, 0.12)',
        glass: '0 4px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
