import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       animation: {
        'fade-in-scale': 'fade-in-scale 0.2s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-slow': 'fade-in-slow 0.5s ease-out forwards',
      },
      keyframes: {
        'fade-in-scale': {
          'from': { transform: 'scale(.95)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-slow': {
          'from': { opacity: '0', transform: 'translateY(5px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
    },
  },
  plugins: [],
};
export default config;
