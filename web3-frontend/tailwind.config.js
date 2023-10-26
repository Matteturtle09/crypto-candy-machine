export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  //...
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2BA84A",

          secondary: "#248232",

          accent: "#2BA84A",

          neutral: "#2D3A3A",
          "base-100" :  "#FCFFFC",
          info: "#040F0F",

          success: "#F4676C",

          warning: "#F4676C",

          error: "#F4676C",
        },
      },
    ],
  },
};
