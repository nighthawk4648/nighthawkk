// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },
//     },
//   },
//   plugins: [],
// };





/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // primary: '#614E00',
        primary: '#000000',
        'secondary-man': '#0b1d65',
        'secondary-women': '#410f57',
        'secondary-kids': '#25d55f',
        secondary: '#000000',
        red_primary: '#A11B1B',
        thirdColor:'#100b12'
      }
    },
    container: {
      center: true,
      padding: '5px',
      screens: {
        sm: '100%',
        md: '100%',
        // lg: '1024px',
        // xl: '1180px',
        lg: '95%',
        xl: '95%',
      },
    }
  },
  plugins: [],
};
