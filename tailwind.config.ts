// import type { Config } from "tailwindcss";

// const config: Config = {
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
//       colors: {
//         // Define your custom colors here for better organization
//         primary: {
//           light: '#FFF7F0',
//           dark: '#0A1128',
//         },
//         text: {
//           light: '#4B3F35',
//           dark: '#A3B4D8',
//         },
//         accent: {
//           light: '#A35400',
//           dark: '#A3B4D8',
//         },
//         card: {
//           light: '#FFEBD6',
//           dark: '#1C2D4D',
//         },
//       },
//     },
//   },
//   plugins: [
//     function ({addUtilities}: {addUtilities:any}){
//       const newUtilities = {
//       ".scrollbar-ms" :{
//         scrollbarWidth: "thin",
//         scrollbarColor: "rgb(55, 54, 66) white",    
//         "&.dark": {
//           scrollbarColor: "white rgb(55, 54, 66)",
//         }   
//       },
//       ".scrollbar-webkit":{
//         "&::-webkit-scrollbar":{
//           width: "8px",
//         },
//         "&::-webkit-scrollbar-track":{
//           background: "white",
//           borderRadius: "20px",
//         },
//         "&::-webkit-scrollbar-thumb":{
//           background: "rgb(55, 54, 66)",
//           borderRadius: "20px",
//           border: "1px solid white"
//         },
//         "&.dark::-webkit-scrollbar-track":{
//           background: "#1C2D4D",
//         },
//         "&.dark::-webkit-scrollbar-thumb":{
//           background: "#A3B4D8",
//           border: "1px solid #1C2D4D"
//         },
//       },
//       '.capitalize-first:first-letter': {
//         textTransform: 'uppercase',
//       },
//     }
//     addUtilities(newUtilities, ["responsive", "hover", "dark"])
//     }
//   ],
//   darkMode: 'class',
// };
// export default config;