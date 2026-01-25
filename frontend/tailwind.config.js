/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        obsidian: '#020203', // Deepest background
        charcoal: '#0c0c0e', // Surface
        slate: '#1f2024',    // Border/Interactive
        cyan: {
          DEFAULT: '#00f3ff',
          dim: 'rgba(0, 243, 255, 0.1)',
          glow: 'rgba(0, 243, 255, 0.5)',
        },
        magenta: {
          DEFAULT: '#ff00ff',
          dim: 'rgba(255, 0, 255, 0.1)',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f2024 1px, transparent 1px), linear-gradient(to bottom, #1f2024 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}