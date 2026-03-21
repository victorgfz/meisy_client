/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        success: 'var(--color-success)',
        'success-hover': 'var(--color-success-hover)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-on-gradient': 'var(--color-text-on-gradient)',
        'bg-card': 'var(--color-bg-card)',
        'bg-body': 'var(--color-bg-body)',
        border: 'var(--color-border)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        input: 'var(--radius-input)',
        button: 'var(--radius-button)',
        pill: 'var(--radius-pill)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
      },
    },
  },
  plugins: [],
}
