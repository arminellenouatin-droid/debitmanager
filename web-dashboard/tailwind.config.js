/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: '#0F4C3A',
          light: '#E8F3EE',
        },
        secondary: '#D9A441',
        
        // Semantic colors (light mode)
        success: '#1E8E3E',
        warning: '#F59E0B',
        danger: '#DC2626',
        info: '#2563EB',
        
        // Semantic colors (dark mode)
        dark: {
          success: '#3DDC84',
          warning: '#FBBF24',
          danger: '#F87171',
          info: '#60A5FA',
        },
        
        // Neutrals (light mode)
        background: '#FFFFFF',
        surface: '#F7F8F7',
        border: '#E2E4E2',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'text-disabled': '#B0B4B0',
        
        // Neutrals (dark mode)
        'dark-background': '#0E1512',
        'dark-surface': '#182420',
        'dark-border': '#2A3833',
        'dark-text-primary': '#F3F4F2',
        'dark-text-secondary': '#9CA69F',
        'dark-text-disabled': '#4B5750',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        modal: '0 8px 24px rgba(0,0,0,0.16)',
      },
      fontSize: {
        display: ['32px', { lineHeight: '40px', fontWeight: '700' }],
        h1: ['24px', { lineHeight: '32px', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        h3: ['17px', { lineHeight: '24px', fontWeight: '600' }],
        body: ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'body-strong': ['15px', { lineHeight: '22px', fontWeight: '600' }],
        caption: ['13px', { lineHeight: '18px', fontWeight: '400' }],
        button: ['16px', { lineHeight: '24px', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
}
