import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'var(--ink-950)',
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
        },
        paper: {
          50: 'var(--paper-50)',
          100: 'var(--paper-100)',
        },
        violet: {
          500: 'var(--violet-500)',
          700: 'var(--violet-700)',
        },
        gold: {
          400: 'var(--gold-400)',
        },
        mint: {
          300: 'var(--mint-300)',
        },
        coral: {
          400: 'var(--coral-400)',
        }
      },
    },
  },
  plugins: [],
}
export default config
