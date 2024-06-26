import fs from 'node:fs';
import { isPackageExists } from 'local-pkg';
import globals from 'globals';

import ignoreGitignore from 'eslint-config-flat-gitignore';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import pluginTs from '@typescript-eslint/eslint-plugin';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';
import pluginTailwind from 'eslint-plugin-tailwindcss';
import pluginJsonc from 'eslint-plugin-jsonc';
import pluginFormat from 'eslint-plugin-format';
import pluginMarkdown from 'eslint-plugin-markdown';
import pluginYaml from 'eslint-plugin-yml';
import pluginAntfu from 'eslint-plugin-antfu';

import parserTs from '@typescript-eslint/parser';
import parserVue from 'vue-eslint-parser';
import parserJsonc from 'jsonc-eslint-parser';
import parserYaml from 'yaml-eslint-parser';

// stylelint

const GLOB_TS = '**/*.?([cm])ts';
const GLOB_TSX = '**/*.?([cm])tsx';
const GLOB_DTS = '**/*.d.?([cm])ts';
const GLOB_VUE = '**/*.vue';
const GLOB_SRC = '?([cm])[jt]s?(x)';
const GLOB_JS = `**/*.${GLOB_SRC}`;
const GLOB_XML = '**/*.xml';
const GLOB_HTML = '**/*.htm?(l)';
const GLOB_CSS = '**/*.css';
const GLOB_POSTCSS = '**/*.{p,post}css';
const GLOB_LESS = '**/*.less';
const GLOB_SCSS = '**/*.scss';
const GLOB_JSON = '**/*.json';
const GLOB_JSON5 = '**/*.json5';
const GLOB_JSONC = '**/*.jsonc';
const GLOB_YAML = '**/*.y?(a)ml';

const GLOB_MARKDOWN = '**/*.md';
const GLOB_MARKDOWN_CODE = `${GLOB_MARKDOWN}/${GLOB_SRC}`;

const StylisticConfigDefaults = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: true,
};

const getSubOptions = (options, key) => {
  return typeof options[key] === 'boolean' ? {} : options[key] || {};
};
const renameRules = (rules, map) => {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`))
            return [to + key.slice(from.length), value];
        }
        return [key, value];
      }),
  );
};
const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: code => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
};

const vue = (options = {}) => {
  const {
    files = [GLOB_VUE],
    stylistic = true,
    vueVersion = 3,
  } = options;
  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  return [
    {
      name: 'vue/setup',
      plugins: {
        vue: pluginVue,
      },
    },
    {
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript ? parserTs : null,
          sourceType: 'module',
        },
      },
    },
    ...pluginVue.configs['flat/recommended'],
    {
      name: 'vue/rules',
      processor: pluginVue.processors['.vue'],
      rules: {
        ...pluginVue.configs.base.rules,

        ...vueVersion === 2 ?
            {
              ...pluginVue.configs.essential.rules,
              ...pluginVue.configs['strongly-recommended'].rules,
              ...pluginVue.configs.recommended.rules,
            } :
            {
              ...pluginVue.configs['vue3-essential'].rules,
              ...pluginVue.configs['vue3-strongly-recommended'].rules,
              ...pluginVue.configs['vue3-recommended'].rules,
            },

        'node/prefer-global/process': 'off',
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],

        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
          },
        ],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-indent': ['error', indent],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        'vue/prefer-import-from-vue': 'off',

        // stylitic
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { after: true, before: true }],
        'vue/block-spacing': ['error', 'always'],
        'vue/block-tag-newline': [
          'error',
          {
            multiline: 'always',
            singleline: 'always',
          },
        ],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { after: true, before: false }],
        'vue/comma-style': ['error', 'last'],
        'vue/html-comment-content-spacing': [
          'error',
          'always',
          {
            exceptions: ['-'],
          },
        ],
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        // 'vue/object-curly-newline': 'off',
        'vue/object-curly-newline': ['error', { consistent: true, multiline: true }],
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
        'vue/operator-linebreak': ['error', 'after'],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/space-in-parens': ['error', 'never'],
        'vue/template-curly-spacing': 'error',
      },
    },
    {
      files: ['**/__tests__/**'],
      rules: {
        'no-console': 'off',
        'vue/one-component-per-file': 'off',
      },
    },
  ];
};
const ts = (options = {}) => {
  const {
    overrides = {},
    parserOptions = {},
  } = options;
  const files = [GLOB_TS, GLOB_TSX];

  return [
    {
      name: 'typescript/setup',
      plugins: {
        ts: pluginTs,
      },
    },
    {
      name: 'typescript/parser',
      files,
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: [],
          sourceType: 'module',
          ...parserOptions,
        },
      },
    },
    {
      name: 'typescript/rules',
      files,
      rules: {
        ...renameRules(
          pluginTs.configs['eslint-recommended'].overrides[0].rules,
          { '@typescript-eslint': 'ts' },
        ),
        ...renameRules(
          pluginTs.configs.strict.rules,
          { '@typescript-eslint': 'ts' },
        ),
        'no-dupe-class-members': 'off',
        'no-loss-of-precision': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'ts/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        'ts/ban-types': ['error', { types: { Function: false } }],
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/consistent-type-imports': ['error', { disallowTypeAnnotations: false, prefer: 'type-imports' }],
        'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        'ts/no-dupe-class-members': 'error',
        'ts/no-dynamic-delete': 'off',
        'ts/no-explicit-any': 'off',
        'ts/no-extraneous-class': 'off',
        'ts/no-import-type-side-effects': 'error',
        'ts/no-invalid-void-type': 'off',
        'ts/no-loss-of-precision': 'error',
        'ts/no-non-null-assertion': 'off',
        'ts/no-redeclare': 'error',
        'ts/no-require-imports': 'error',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'ts/no-useless-constructor': 'off',
        'ts/prefer-ts-expect-error': 'error',
        'ts/triple-slash-reference': 'off',
        'ts/unified-signatures': 'off',
        ...overrides,
      },
    },
    {
      files: [GLOB_DTS],
      name: 'typescript/disables/dts',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      name: 'typescript/disables/test',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'typescript/disables/cjs',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ];
};
const js = (options = {}) => {
  const { overrides = {} } = options;
  return [
    {
      name: 'javascript/setup',
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly',
        },
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
    },
    {
      name: 'javascript/rules',
      plugins: {
        'unused-imports': pluginUnusedImports,
      },
      rules: {
        'accessor-pairs': [
          'error',
          {
            enforceForClassMembers: true,
            setWithoutGet: true,
          },
        ],
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'constructor-super': 'error',
        'default-case-last': 'error',
        'dot-notation': [
          'error',
          {
            allowKeywords: true,
          },
        ],
        'eqeqeq': ['error', 'smart'],
        'new-cap': [
          'error',
          {
            capIsNew: false,
            newIsCap: true,
            properties: true,
          },
        ],
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-async-promise-executor': 'error',
        'no-caller': 'error',
        'no-case-declarations': 'error',
        'no-class-assign': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-const-assign': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-delete-var': 'error',
        'no-dupe-args': 'error',
        'no-dupe-class-members': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty': [
          'error',
          {
            allowEmptyCatch: true,
          },
        ],
        'no-empty-character-class': 'error',
        'no-empty-pattern': 'error',
        'no-eval': 'error',
        'no-ex-assign': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-boolean-cast': 'error',
        'no-fallthrough': 'error',
        'no-func-assign': 'error',
        'no-global-assign': 'error',
        'no-implied-eval': 'error',
        'no-import-assign': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-iterator': 'error',
        'no-labels': [
          'error',
          {
            allowLoop: false,
            allowSwitch: false,
          },
        ],
        'no-lone-blocks': 'error',
        'no-loss-of-precision': 'error',
        'no-misleading-character-class': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-native-nonconstructor': 'error',
        'no-new-wrappers': 'error',
        'no-obj-calls': 'error',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-prototype-builtins': 'error',
        'no-redeclare': [
          'error',
          {
            builtinGlobals: false,
          },
        ],
        'no-regex-spaces': 'error',
        'no-restricted-globals': [
          'error',
          { message: 'Use `globalThis` instead.', name: 'global' },
          { message: 'Use `globalThis` instead.', name: 'self' },
        ],
        'no-restricted-properties': [
          'error',
          { message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.', property: '__proto__' },
          { message: 'Use `Object.defineProperty` instead.', property: '__defineGetter__' },
          { message: 'Use `Object.defineProperty` instead.', property: '__defineSetter__' },
          { message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupGetter__' },
          { message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupSetter__' },
        ],
        'no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
          'TSEnumDeclaration[const=true]',
          'TSExportAssignment',
        ],
        'no-self-assign': [
          'error',
          {
            props: true,

          },
        ],
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-shadow-restricted-names': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-this-before-super': 'error',
        'no-throw-literal': 'error',
        'no-undef': 'error',
        'no-undef-init': 'error',
        'no-unexpected-multiline': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': [
          'error',
          {
            defaultAssignment: false,

          },
        ],
        'no-unreachable': 'error',
        'no-unreachable-loop': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'no-unused-vars': 'off',
        'no-use-before-define': [
          'error',
          {
            classes: false,
            functions: false,
            variables: true,
          },
        ],
        'no-useless-backreference': 'error',
        'no-useless-call': 'error',
        'no-useless-catch': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-with': 'error',
        'object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'one-var': [
          'error',
          {
            initialized: 'never',
          },
        ],
        'prefer-arrow-callback': [
          'error',
          {
            allowNamedFunctions: false,
            allowUnboundThis: true,
          },
        ],
        'prefer-const': [
          'error',
          {
            destructuring: 'all',
            ignoreReadBeforeAssign: true,
          },
        ],
        'prefer-exponentiation-operator': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-regex-literals': [
          'error',
          {
            disallowRedundantWrapping: true,
          },
        ],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'sort-imports': [
          'error',
          {
            allowSeparatedGroups: false,
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          },
        ],

        'symbol-description': 'error',
        'unicode-bom': ['error', 'never'],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            vars: 'all',
            varsIgnorePattern: '^_',
          },
        ],
        'use-isnan': [
          'error',
          {
            enforceForIndexOf: true,
            enforceForSwitchCase: true,
          },
        ],
        'valid-typeof': [
          'error',
          {
            requireStringLiterals: true,
          },
        ],
        'vars-on-top': 'error',
        'yoda': ['error', 'never'],

        ...overrides,

      },
    },
    {
      files: [`scripts/${GLOB_JS}`, `cli.${GLOB_SRC}`],
      name: 'javascript/disables/cli',
      rules: {
        'no-console': 'off',
      },
    },
  ];
};
const jsx = () => [
  {
    files: ['**/*.?([cm])jsx', '**/*.?([cm])tsx'],
    name: 'jsx/setup',
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
const yaml = (options = {}) => {
  const {
    files = [GLOB_YAML],
    overrides = {},
    stylistic = true,
  } = options;

  const {
    indent = 2,
    quotes = 'single',
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  return [
    {
      name: 'yaml/setup',
      plugins: {
        yaml: pluginYaml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: 'yaml/rules',
      rules: {
        'style/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/plain-scalar': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...stylistic ?
            {
              'yaml/block-mapping-question-indicator-newline': 'error',
              'yaml/block-sequence-hyphen-indicator-newline': 'error',
              'yaml/flow-mapping-curly-newline': 'error',
              'yaml/flow-mapping-curly-spacing': 'error',
              'yaml/flow-sequence-bracket-newline': 'error',
              'yaml/flow-sequence-bracket-spacing': 'error',
              'yaml/indent': ['error', indent === 'tab' ? 2 : indent],
              'yaml/key-spacing': 'error',
              'yaml/no-tab-indent': 'error',
              'yaml/quotes': ['error', { avoidEscape: false, prefer: quotes }],
              'yaml/spaced-comment': 'error',
            } :
            {},

        ...overrides,
      },
    },
  ];
};
const ignore = (enableGitignore = true) => {
  const ignores = [
    '**/.nuxt',
    '**/.next',
    '**/.vercel',
    '**/node_modules',
    '**/dist',
    '**/.vitepress/cache',
    '**/LICENSE*',
    '**/auto-import?(s).d.ts',
    '**/components.d.ts',
    '**/package-lock.json',
    '**/pnpm-lock.yaml',
  ];

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      ignores.push(...ignoreGitignore(enableGitignore).ignores);
    }
    else {
      if (fs.existsSync('.gitignore')) {
        ignores.push(...ignoreGitignore().ignores);
      }
    }
  }
  return [
    {
      ignores,
    },
  ];
};
const stylistic = (options = {}) => {
  const {
    indent,
    jsx,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
    braceStyle: 'stroustrup',
  });
  return [
    {
      name: 'stylistic/rules',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,
        'style/operator-linebreak': ['error', 'after'],
        'style/array-bracket-newline': [
          'warn',
          {
            multiline: true,
          },
        ],

        'antfu/indent-unindent': 'error',
        'antfu/consistent-list-newline': 'error',
        'antfu/curly': 'error',
        'antfu/if-newline': 'off',
        'antfu/top-level-function': 'off',
      },
    },
  ];
};
const jsonc = (options = {}) => {
  const {
    files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    stylistic = true,
    overrides = { },
  } = options;

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  return [
    {
      name: 'jsonc/setup',
      plugins: {
        jsonc: pluginJsonc,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserJsonc,
      },
      name: 'jsonc/rules',
      rules: {
        'jsonc/no-bigint-literals': 'error',
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-binary-numeric-literals': 'error',
        'jsonc/no-dupe-keys': 'error',
        'jsonc/no-escape-sequence-in-identifier': 'error',
        'jsonc/no-floating-decimal': 'error',
        'jsonc/no-hexadecimal-numeric-literals': 'error',
        'jsonc/no-infinity': 'error',
        'jsonc/no-multi-str': 'error',
        'jsonc/no-nan': 'error',
        'jsonc/no-number-props': 'error',
        'jsonc/no-numeric-separators': 'error',
        'jsonc/no-octal': 'error',
        'jsonc/no-octal-escape': 'error',
        'jsonc/no-octal-numeric-literals': 'error',
        'jsonc/no-parenthesized': 'error',
        'jsonc/no-plus-sign': 'error',
        'jsonc/no-regexp-literals': 'error',
        'jsonc/no-sparse-arrays': 'error',
        'jsonc/no-template-literals': 'error',
        'jsonc/no-undefined-value': 'error',
        'jsonc/no-unicode-codepoint-escapes': 'error',
        'jsonc/no-useless-escape': 'error',
        'jsonc/space-unary-ops': 'error',
        'jsonc/valid-json-number': 'error',
        'jsonc/vue-custom-block/no-parsing-error': 'error',

        'jsonc/array-bracket-spacing': ['error', 'never'],
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/comma-style': ['error', 'last'],
        'jsonc/indent': ['error', indent],
        'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'jsonc/object-curly-newline': ['error', { consistent: true, multiline: true }],
        'jsonc/object-curly-spacing': ['error', 'always'],
        'jsonc/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
        'jsonc/quote-props': 'error',
        'jsonc/quotes': 'error',

        ...overrides,
      },
    },
  ];
};
const tailwindcss = () => {
  return [
    {
      name: 'tailwind/setup',
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    {
      name: 'tailwind/rules',
      plugins: {
        tailwind: pluginTailwind,
      },
      rules: {
        ...renameRules(
          pluginTailwind.configs['flat/recommended'][1].rules,
          { tailwindcss: 'tailwind' },
        ),
        'tailwind/no-custom-classname': 'off',
        'tailwind/enforces-negative-arbitrary-values': 'off',
        'tailwind/no-unnecessary-arbitrary-value': 'error',
      },
    },

  ];
};
const formatters = (options = {}) => {
  const {
    css = true,
    html = true,
    markdown = true,
    xml = isPackageExists('@prettier/plugin-xml'),
    stylistic = {},
  } = options;

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  };

  const prettierOptions = {
    endOfLine: 'auto',
    semi,
    singleQuote: quotes === 'single',
    tabWidth: typeof indent === 'number' ? indent : 2,
    trailingComma: 'all',
    useTabs: indent === 'tab',
  };

  const configs = [
    {
      name: 'formatter/setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  const formatters = {};
  if (css) {
    Object.assign(formatters, {
      css: {
        files: [GLOB_CSS, GLOB_POSTCSS],
        parser: 'css',
      },
      less: {
        files: [GLOB_LESS],
        parser: 'less',
      },
      scss: {
        files: [GLOB_SCSS],
        parser: 'scss',
      },
    });
  }
  if (html) {
    Object.assign(formatters, {
      html: {
        files: [GLOB_HTML],
        parser: 'html',
      },
    });
  }
  if (markdown) {
    Object.assign(formatters, {
      markdown: {
        files: [GLOB_MARKDOWN],
        parser: 'markdown',
        extraRules: {
          printWidth: 200,
          embeddedLanguageFormatting: 'off',
        },
      },
    });
  }
  const prettierXmlOptions = {
    xmlQuoteAttributes: 'double',
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: 'ignore',
  };
  if (xml) {
    Object.assign(formatters, {
      xml: {
        files: [GLOB_XML],
        parser: 'xml',
        extraRules: {
          ...prettierXmlOptions,
          plugins: ['@prettier/plugin-xml'],
        },
      },
    });
  }

  configs.push(
    ...Object.entries(formatters).map(([_type, { files, parser, languageParser = parserPlain, extraRules = {} }]) => ({
      files,
      languageOptions: {
        parser: languageParser,
      },
      name: `formatter/prettier`,
      rules: {
        'format/prettier': [
          'error',
          {
            ...prettierOptions,
            ...extraRules,
            parser,
          },
        ],
      },
    })),
  );
  return configs;
};
const markdown = (options = {}) => {
  const {
    componentExts = [],
    overrides = {},
    files = [GLOB_MARKDOWN],
  } = options;

  return [
    {
      name: 'markdown/setup',
      plugins: {
        markdown: pluginMarkdown,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserPlain,
      },
      name: 'markdown/parser',
    },
    {
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map(ext => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      name: 'markdown/disables',
      rules: {
        'import/newline-after-import': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',

        'node/prefer-global/process': 'off',
        'style/comma-dangle': 'off',

        'style/eol-last': 'off',
        'ts/consistent-type-imports': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',
        'ts/no-var-requires': 'off',

        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        ...overrides,
      },
    },
  ];
};

const VuePackages = ['vue', 'nuxt', 'vitepress'];
const factory = (options = {}) => {
  const {
    gitignore: enableGitignore = true,
    jsx: enableJsx = true,
    typescript: enableTypeScript = isPackageExists('typescript'),
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    tailwindcss: enableTailwindcss = false,
    jsonc: enableJsonc = true,
    markdown: enableMarkdown = true,
    yaml: enableYaml = true,
  } = options;

  const componentExts = [];
  const configs = [];
  const stylisticOptions = options.stylistic === false ? false : typeof options.stylistic === 'object' ? options.stylistic : StylisticConfigDefaults;

  configs.push(
    ...ignore(enableGitignore),
    ...js(getSubOptions(options, 'javascript')),
    ...stylistic(stylisticOptions),
    ...formatters({
      ...getSubOptions(options, 'formatters'),
      stylistic: stylisticOptions,
    }),
  );

  if (enableVue) {
    componentExts.push('vue');
  }
  if (enableJsonc) {
    configs.push(...jsonc({
      ...getSubOptions(options, 'jsonc'),
      stylistic: stylisticOptions,
    }));
  }
  if (enableTailwindcss) {
    configs.push(...tailwindcss());
  }
  if (enableJsx) {
    configs.push(...jsx());
  }
  if (enableTypeScript) {
    configs.push(...ts(getSubOptions(options, 'typescript'),
    ));
  }
  if (enableVue) {
    configs.push(
      ...vue({
        ...getSubOptions(options, 'vue'),
        typescript: !!enableTypeScript,
        stylistic: stylisticOptions,
      }),
    );
  }
  if (enableMarkdown) {
    configs.push(
      ...markdown({
        ...getSubOptions(options, 'markdown'),
        componentExts,
      }),
    );
  }
  if (enableYaml) {
    configs.push(
      ...yaml({
        ...getSubOptions(options, 'yaml'),
        stylistic: stylisticOptions,
      }),
    );
  }
  return configs;
};

export default factory({
  tailwindcss: true,
});
