import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cowry: {
          primary: "#1558B0",
          "primary-hover": "#0f4388",
          text: "#0B1F3A",
          muted: "#4A5D78",
          border: "#D6E0EE",
          footer: "#EEF3FA",
          pill: "#E8F0FB",
        },
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};

export default config;

