export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
        },
        brandPurple: {
          100: '#f3e8ff',
          500: '#a855f7',
        },
        brandBlue: {
          100: '#dbeafe',
          500: '#3b82f6',
        },
        brandNeutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
        },
        warning: {
          50: '#fef9c3',
          100: '#fef08a',
          500: '#d97706',
        },
        critical: {
          50: '#fee2e2',
          100: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
        },
        surface: '#ffffff',
        muted: '#64748b',
        glass: 'rgba(255,255,255,0.72)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.75rem' }],
        lg: ['1.125rem', { lineHeight: '1.85rem' }],
        xl: ['1.25rem', { lineHeight: '1.9rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.05' }],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0em',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.16em',
      },
      boxShadow: {
        card: '0 20px 45px rgba(15, 23, 42, 0.08)',
        cardHover: '0 30px 60px rgba(15, 23, 42, 0.12)',
        glow: '0 18px 45px rgba(99, 102, 241, 0.18)',
        innerSoft: 'inset 0 1px 0 rgba(255,255,255,0.72)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
        gentle: 'cubic-bezier(0.35, 0, 0.25, 1)',
        entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        150: '150ms',
        250: '250ms',
        350: '350ms',
        500: '500ms',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-in-out both',
        'slide-up': 'slide-up 0.65s ease-out both',
        'slide-down': 'slide-down 0.6s ease-out both',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 1.5s linear infinite',
        ripple: 'ripple 0.8s ease-out both',
        'stagger-fade': 'stagger-fade 0.6s ease-in-out both',
        'enter-modal': 'enter-modal 0.45s ease-in-out both',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.16)' },
          '50%': { boxShadow: '0 0 0 18px rgba(99, 102, 241, 0.04)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ripple: {
          '0%': { opacity: '0.4', transform: 'scale(0.2)' },
          '100%': { opacity: '0', transform: 'scale(1.8)' },
        },
        'stagger-fade': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'enter-modal': {
          '0%': { opacity: '0', transform: 'translateY(28px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      },
      backgroundImage: {
        'brand-radial': 'radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 40%)',
        'soft-gradient': 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(139, 92, 246, 0.08))',
        'hero-glow': 'linear-gradient(180deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.08) 100%)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
      },
      minHeight: {
        'screen-75': '75vh',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};
