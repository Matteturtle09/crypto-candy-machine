/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2b54ce",

          secondary: "#f7f5a0",

          accent: "#03c62a",

          neutral: "#191a2a",

          "base-100": "#4e4351",

          info: "#5e7bd9",

          success: "#3ae4c2",

          warning: "#ac9211",

          error: "#fb0452",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
