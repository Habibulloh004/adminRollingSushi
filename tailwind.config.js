/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        sidebar: "3px 0px 25px -3px rgba(82,82,82,1)",
        shadowme: "0px 0px 20px 3px rgba(107,107,107,.2)"
      },
      colors: {
        cText: "#373737",
        primary: "#004032",
        secondary: "rgba(255,255,255, .5)",
      },
    },
  },
  plugins: [import("daisyui")],
};
