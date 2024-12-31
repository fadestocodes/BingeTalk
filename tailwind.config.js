/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#151718",
        //252422//
        //good with mustard 17223B 263859 022C43
        //potential combo 06283D
        secondary: {
          DEFAULT: "#F6BD60",
          //FFFCF2//
          100: "#f3aa35",
          200: "#f19a0e",
        },
        //potential combo 47B5FF
        //chocolate 403D39
        //orange EB5E28
        //bone CCC5B9
        //mustard F6BD60
        //muted AB9F9D
        //lighter muted D1BEB0
        //light milky FEFAE0
        //almost white F8FAFC
        //white blue D9EAFD
        //muted gold D7B26D
        third: {
          DEFAULT : "#FEFAE0"
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
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
      },
    },
  },
  plugins: [],
}