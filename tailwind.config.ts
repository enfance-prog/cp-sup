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
        // Cafe & Salon Palette
        primary: {
          50: '#F4F6F4',
          100: '#E6EAE7',
          200: '#CAD4CD',
          300: '#AEBDB4',
          400: '#91A79B',
          500: '#5F6F65', // Main Sage
          600: '#4C5951',
          700: '#39433D',
          800: '#262D29',
          900: '#131614',
        },
        secondary: {
          50: '#FBFBF6',
          100: '#F5F6EB',
          200: '#EBEED5',
          300: '#DFE5BD',
          400: '#D2DCA6',
          500: '#9CA778', // Matcha/Olive
          600: '#7D8660',
          700: '#5E6448',
          800: '#3E4330',
          900: '#1F2118',
        },
        accent: {
          50: '#FCFBF9',
          100: '#F7F4F0',
          200: '#EEE7DF',
          300: '#E5DACD',
          400: '#DCCDBD',
          500: '#D8C3A5', // Sand/Beige
          600: '#AD9C84',
          700: '#827563',
          800: '#564E42',
          900: '#2B2721',
        },
        text: {
          main: '#4A4238', // Warm Charcoal
          muted: '#8C857B',
          light: '#D4D0C7',
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
