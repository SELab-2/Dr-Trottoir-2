/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      light: {
        bg: {
          1: "#FFFFFF",
          2: "#F6F8FA",
        },
        h: {
          1: "#000000",
          2: "#B2B2B2",
        },
        text: "#4D4D4D",
        border: "#E6E6E6",
      },
      dark: {
        bg: {
          1: "#101010",
          2: "#1c1c1c",
        },
        h: {
          1: "#FFFFFF",
          2: "#4D4D4D",
        },
        text: "#B2B2B2",
        border: "#262626",
      },
      accent: {
        1: "#E6E600",
        2: "#585936",
        3: "#c7c700",
      },
      primary: {
        1: "#377DFF",
        2: "#D7E5FF",
        3: "#2c66d3",
      },
      done: {
        1: "#8250DF",
        2: "#D6CCED",
      },
      good: {
        1: "#2DA44C",
        2: "#CEF5D2",
      },
      meh: {
        1: "#D29922",
        2: "#FFDCCC",
      },
      bad: {
        1: "#CF222E",
        2: "#FFD4DF",
      },
      tags: {
        1: "#FFEAB6",
        2: "#FFEAB6",
        3: "#E2D5F7",
        5: "#fcccf0",
      },
      waste: {
        paper: "#003088",
        PMD: "#c8d7ff",
        rest: "#282825",
        glass: "#ffd500",
        GFT: "#165e00",
        other: "#000000",
      },
      waste: {
        paper: "#003088",
        PMD: "#c8d7ff",
        rest: "#282825",
        glass: "#ffd500",
        other: "#000000",
      },
    },
    fontSize: {
      xs: "10px",
      base: "14px",
      lg: "21px",
      xl: "27px",
      xxl: "32px",
    },
    extend: {
      strokeLinecap: {
        square: "square",
        round: "round",
        butt: "butt",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".stroke-linecap-square": {
          "stroke-linecap": "square",
        },
        ".stroke-linecap-round": {
          "stroke-linecap": "round",
        },
        ".stroke-linecap-butt": {
          "stroke-linecap": "butt",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
