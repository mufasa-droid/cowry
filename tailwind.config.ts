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
          ink: "#0B1F3A",
          text: "#0B1F3A",
          muted: "#4A5D78",
          hairline: "#D6E0EE",
          border: "#D6E0EE",
          footer: "#F7F9FC",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
      maxWidth: {
        container: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
