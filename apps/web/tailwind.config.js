/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDF9F1',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        primary: '#FFB800',
        accent: '#E91E63',
        success: '#10B981',
        danger: '#EF4444',
        border: '#111827',
        text: '#111827',
        muted: '#6B7280',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px #111827',
        'brutal-lg': '8px 8px 0px 0px #111827',
        'brutal-active': '2px 2px 0px 0px #111827',
      }
    },
  },
  plugins: [],
};
