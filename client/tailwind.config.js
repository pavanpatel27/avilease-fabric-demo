/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        prodigy: {
          crimson: '#EC0051',
          saffron: '#FFC600',
          dark: '#272727',
          darker: '#1c1c1c',
          ink: '#272727',
          muted: '#6b6b6b',
          soft: '#FAFAFA',
          line: '#E8E8E8',
          panel: '#FFFFFF',
        },
        avi: {
          deep: '#003B51',
          teal: '#00697B',
          mint: '#50B9A1',
          mist: '#D2EAD5',
          fog: '#FAFBFB',
        },
      },
      fontFamily: {
        sans: ['"Lexend Deca"', 'Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        brand: '0 18px 50px rgba(236, 0, 81, 0.22)',
        card: '0 8px 28px rgba(39, 39, 39, 0.08)',
      },
    },
  },
  plugins: [],
};
