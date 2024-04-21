import prismjs from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import consola from 'consola';

loadLanguages(['markup', 'css', 'typescript']);

const langMap = {
    vue: 'markup',
    html: 'markup',
    md: 'markdown',
    ts: 'typescript',
    js: 'javascript',
    py: 'python',
    sh: 'bash',
};
function wrap(code: string, lang: string): string {
    // if (lang === 'text') {
    //   code = escapeHtml(code)
    // }
    return `<pre v-pre><code>${code}</code></pre>`;
}

export const highlight = (str: string, lang: string) => {
    if (!lang) {
        return wrap(str, 'text');
    }
    lang = lang.toLowerCase();
    const rawLang = lang;
    lang = langMap[lang];
    if (!prismjs.languages[lang]) {
        try {
            loadLanguages([lang]);
        } catch {
            consola.warn(`[vitepress] Syntax highlight for language "${lang}" is not supported.`);
        }
    }
    if (prismjs.languages[lang]) {
        const code = prismjs.highlight(str, prismjs.languages[lang], lang);
        return wrap(code, rawLang);
    }
    return wrap(str, 'text');
};
