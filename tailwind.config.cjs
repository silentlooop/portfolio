/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        surface: {
          bg: "var(--surface-bg)",
          raised: "var(--surface-raised)",
        },
        edge: {
          DEFAULT: "var(--surface-border)",
          hover: "var(--surface-border-hover)",
        },
      },
      fontSize: {
        "2xs": ["12px", { lineHeight: "16px" }],
        heading: ["28px", { lineHeight: "36px", letterSpacing: "-0.01em" }],
        hero: ["clamp(2.75rem, 6vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      transitionDuration: {
        150: "150ms",
        250: "250ms",
        400: "400ms",
      },
      maxWidth: {
        content: "1100px",
      },
      keyframes: {
        highlight: {
          "0%": { backgroundColor: "transparent" },
          "100%": { backgroundColor: "var(--highlight)" },
        },
        flash: {
          "0%": { backgroundColor: "hsl(var(--card))" },
          "50%": { backgroundColor: "var(--highlight)" },
          "100%": { backgroundColor: "hsl(var(--card))" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        blinkSlow: {
          "0%, 100%": { opacity: "0.03" },
          "50%": { opacity: "0.07" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        highlight: "highlight 0.6s ease forwards",
        flash: "flash 0.6s ease forwards",
        blink: "blink 0.6s step-end infinite",
        "blink-slow": "blinkSlow 0.9s ease-in-out infinite 0.3s",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
      fontFamily: {
        hand: ['Caveat', '"Bradley Hand"', 'cursive'],
        sfmono: ["SF Mono", "Space Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", 'monospace'],
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
        sfpro: ['"SF Pro Display"', '"SF Pro Text"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        spacegrotesk: ['"Space Grotesk"', 'Inter', 'system-ui', 'Arial', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        "neue-haas-unica": ['"Neue Haas Unica"', '"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },

    }
  }, // Added missing closing brace and comma
  plugins: [
    // Add plugins here if needed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
  // Optional: Configure dark mode
  darkMode: 'class', // or 'media' or false
}