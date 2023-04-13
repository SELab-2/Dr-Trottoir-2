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
      },
      accent: {
        1: "#E6E600",
        2: "#585936",
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
    },
    fontSize: {
      base: "14px",
      lg: "21px",
    },
    extend: {},
  },
  plugins: [],
};
