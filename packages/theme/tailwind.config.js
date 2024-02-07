/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.less'],
    theme: {
        extend: {
            animation: {
                'fade-out': 'cdx-fade-out var(--cdx-transition-duration) ease-in-out',
                'fade-in': 'cdx-fade-in var(--cdx-transition-duration) ease-in-out',
                rotate: 'cdx-rotate 2s linear infinite',
                'loading-dash': 'cdx-loading-dash 1.5s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
