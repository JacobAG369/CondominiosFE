/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#B08968',
                    hover: '#9C7A5E',
                },
                secondary: {
                    DEFAULT: '#DDB892',
                    hover: '#CFA782',
                },
                'bg-sand': '#F7F3EE',
                'border-soft': '#E7DED5',
                'text-dark': '#2B2B2B',
            },
        },
    },
    plugins: [],
}
