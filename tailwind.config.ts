import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Reference Design Palette (MINT DENTAL Style - Clean, Teal, Soft Gray)
        primary: {
          50: '#F0F9FA',
          100: '#E0F4F6',
          200: '#BFE6EB',
          300: '#9DD7DE',
          400: '#7CC8D1',
          500: '#40B1BD', // Reference Main Teal
          600: '#338E97',
          700: '#266A71',
          800: '#19474C',
          900: '#0D2326',
        },
        // Secondary / Background Accents
        secondary: {
          50: '#F8FBFB', // Very subtle cool white
          100: '#F1F8F9', // Reference Light Mint Gray (Section bg)
          200: '#E2EEF0',
          300: '#D4E4E7',
          400: '#C5DADD',
          500: '#A6C2C6',
          600: '#8DA6AA',
          700: '#738A8D',
          800: '#5A6E71',
          900: '#405255',
        },
        // Accent Colors (Sky/Blue - kept for certain highlights if needed)
        accent: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        // Clean White Base
        base: {
          white: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
        },
        text: {
          main: '#000000', // Reference Black (High Contrast)
          muted: '#666666', // Standard muted
          light: '#D1D5DB',
        }
      },
      fontFamily: {
        serif: ['"Zen Old Mincho"', 'serif'],
        sans: ['"Zen Kaku Gothic New"', 'sans-serif'],
      },
      animation: {
        'fade-in-slow': 'fadeIn 1.2s ease-out forwards',
        'slide-up-slow': 'slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(2rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')", // Optional subtle texture
      }
    },
  },
  plugins: [],
};

export default config;
