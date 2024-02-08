/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.less'],
    theme: {
        extend: {
            animation: {
                'fade-in': 'cdx-fade-in var(--cdx-transition-duration) ease-in-out',
                'fade-out': 'cdx-fade-out var(--cdx-transition-duration) ease-in-out',
                'zoom-in': 'cdx-zoom-in var(--cdx-transition-duration) ease-in-out',
                'zoom-out': 'cdx-zoom-out var(--cdx-transition-duration) ease-in-out',
                rotate: 'cdx-rotate 2s linear infinite',
                'loading-dash': 'cdx-loading-dash 1.5s ease-in-out infinite',
            },
            boxShadow: {
                wrap: '0px 0px 4px 2px rgb(0 0 0 / .2)',
            },
        },
    },
    plugins: [],
};
