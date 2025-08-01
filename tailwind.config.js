/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#171717",
        primaryLight : '#1f2223',
        primaryDark : '#0e1010',
        // secondary: "#c2fc03", 
        secondary: "#ffe600", 
        secondary200 : '#f19a0e',
        third : '#FEFAE0',
        lightBlack : '#414549',
        mainGray : '#9ca3af',
        mainGrayLight:'#bfb9a6',
        mainGrayDark:'#525252',
        darkGray : '#232533',
        lightGray : '#CDCDE0'
      },
      fontFamily: {
        pthin: ["Geist-Thin", "sans-serif"],
        pextralight: ["Geist-ExtraLight", "sans-serif"],
        plight: ["Geist-Light", "sans-serif"],
        pregular: ["Geist-Regular", "sans-serif"],
        pmedium: ["Geist-Medium", "sans-serif"],
        psemibold: ["Geist-SemiBold", "sans-serif"],
        pbold: ["Geist-Bold", "sans-serif"],
        pextrabold: ["Geist-ExtraBold", "sans-serif"],
        pblack: ["Geist-Black", "sans-serif"],
        pcourier : ["Courier","Courier-New", "serif"]
      },
      fontSize: {
        custom: ['15px','16px'], // 15px font size with a 20px line height (close to `leading-5`)
      },
    },
  },
  plugins: [],
}