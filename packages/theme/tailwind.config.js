/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.less'],
    theme: {
        extend: {
            transitionDuration: {
                'var-duration': 'var(--cdx-transition-duration)',
            },
            animation: {
                'fade-out': 'cdx-fade-out var(--cdx-transition-duration) ease-in-out',
                'fade-in': 'cdx-fade-in var(--cdx-transition-duration) ease-in-out',
            },
        },
    },
    plugins: [],
};
