import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    boxShadow: {
      DEFAULT: "0 4px 20px 0 rgb(7 6 18 / 0.1)",
    },
    extend: {
      colors: {
        "primary-400": "#67985F",
        "input-background": "#3B4758",
        background: "#161B21",
        "pane-background": "#1D232C",
        "input-placeholder": "#BAC4D1",
        error: "#AD3D35",
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
    },
  },
  plugins: [],
};
export default config;
