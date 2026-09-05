/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Navy corporate & export credibility
        'navy-deep':     '#061325',
        'navy-main':     '#0b1e36',
        'navy-card':     '#0f2644',
        'navy-light':    '#173864',
        'navy-accent':   '#1e477e',

        // Emerald & organic nature green
        'organic-green': '#1b4332',
        'organic-emerald':'#2d6a4f',
        'organic-leaf':  '#40916c',
        'organic-mint':  '#74c69d',
        'organic-soft':  '#e9f5ed',

        // Gold & warm accents
        'accent-yellow': '#e9c46a',
        'accent-gold':   '#f4a261',
        'accent-amber':  '#e76f51',
        'accent-sun':    '#ffb703',

        // Dark backgrounds
        'dark-charcoal': '#07111e',
        'dark-bg':       '#091524',
        'warm-gray':     '#f4f7fa',
        'warm-surface':  '#f8fafc',
        'text-muted':    '#64748b',
      },
      fontFamily: {
        'heading': ['"Nunito Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
        'sans':    ['"Inter"', 'sans-serif'],
        'body':    ['"Inter"', 'sans-serif'],
        'display': ['"Plus Jakarta Sans"', '"Nunito Sans"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        'marquee-reverse': 'marquee-reverse 32s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(233, 196, 106, 0.35)',
        'emerald-glow': '0 0 25px rgba(45, 106, 79, 0.35)',
        'card-hover': '0 20px 40px -15px rgba(11, 30, 54, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
