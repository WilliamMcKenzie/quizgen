import type { Config } from "tailwindcss";
import daisyui from 'daisyui'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mycustomtheme: {
          primary: "#ffbb00",
          secondary: "#9900ff",
          accent: "#ff0066",
          neutral: "#3d4451",
          "base-100": "#ffffff",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
          "--btn-text-primary": "#ffffff",
          ".btn-primary": {
            "color": "#FFF6DD",
          },
          ".bg-primary": {
            "color": "#FFF6DD",
          },
          ".btn-accent": {
            "color": "#FFD7E7",
          },
        },
      },
    ],
  },
};
export default config;
