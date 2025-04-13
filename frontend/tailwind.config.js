/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3498db",
                secondary: "#2c3e50",
                success: "#2ecc71",
                danger: "#e74c3c",
                warning: "#f39c12",
                info: "#3498db",
            },
        },
    },
    plugins: [],
} 