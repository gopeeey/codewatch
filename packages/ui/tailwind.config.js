/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/routes/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    boxShadow: {
      DEFAULT: "0 4px 20px 0 rgb(7 6 18 / 0.1)",
    },

    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "primary-700": "#2E5927",
        "primary-400": "#67985F",
        "primary-300": "#80A979",
        "input-background": "#3B4758",
        "input-background-dark": "#2b333f",
        background: "#161B21",
        "pane-background": "#1D232C",
        "input-placeholder": "#BAC4D1",
        error: "#AD3D35",
        "error-bright": "#EC7168",
        "error-dark": "#7C2C26",
        "grey-50": "#F6F8F9",
        "grey-100": "#E4E8ED",
        "grey-200": "#D7DDE5",
        "grey-300": "#C5CDD9",
        "grey-400": "#BAC4D1",
        "grey-500": "#A9B5C6",
        "grey-600": "#9AA5B4",
        "grey-700": "#78818D",
        "grey-800": "#5D646D",
        "grey-900": "#474C53",
      },
      fontSize: {
        xs: ["0.68rem", "0.94rem"],
        sm: ["0.835rem", "1.1rem"],
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [],
};
