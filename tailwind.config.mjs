/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: '#1C1F2A',
        orange: '#FE5000',
        ink: '#292929',
        cream: '#F8F7F2',
        'orange-pale': '#FFEDDD',
        'orange-soft': '#FFB371',
        'gray-light': '#E8E6E0',
        'gray-mid': '#999999',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.02em',
        'display-tight': '-0.04em',
        eyebrow: '0.25em',
      },
    },
  },
  plugins: [],
};
