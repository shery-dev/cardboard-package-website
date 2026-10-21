/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        headingTxtColor: "#1A3263",
        headingHover: "#547792",
        mainBgColor: "#FAB95B",
        mainBgHover: "#e5a84a",
        heroSecBg: "#E8E2DB",
        secDifferBg: "#E8E2DB",
        grayPink: "#E8E2DB",
        rollBg: "#FAB95B",
        quoteBgColor: "#547792"
      },
      fontFamily: {
        'inter': ['var(--font-inter)'],
        'lora': ['var(--font-lora)']
      },
      backgroundImage:{
        'quoteBg': "url('./img/quote_header_image.png')",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "gradient-shift": "gradient-shift 4s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
