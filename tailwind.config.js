/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy Blue primary palette
        'organic-green':  '#0d2137',   // deep navy (was organic green)
        'organic-mid':    '#1a4480',   // medium navy
        'organic-light':  '#2d72d9',   // bright blue accent
        // Accent
        'accent-yellow':  '#e9c46a',   // warm yellow (unchanged)
        'accent-gold':    '#f4a261',   // orange-gold
        // Dark backgrounds
        'dark-charcoal':  '#0a1628',   // very deep navy-black
        'dark-bg':        '#0d1b2a',   // near-black navy
        'warm-gray':      '#f0f4f8',   // cool light gray
        'text-muted':     '#6b7280',
        // Extra navy shades
        'navy-hover':     '#0a1e3d',
        'navy-border':    '#1e3a6e',
      },
      fontFamily: {
        'heading': ['Nunito Sans', 'sans-serif'],
        'body':    ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 100%)',
      },
    },
  },
  plugins: [],
}
