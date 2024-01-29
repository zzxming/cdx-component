/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.less'],
    theme: {
        extend: {
            transitionDuration: {
                'var-duration': 'var(--cdx-transition-duration)',
            },
        },
    },
    plugins: [],
};
