import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default tseslint.config(
    { ignores: ['dist', 'node_modules', 'old_script'] },
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        extends: [...tseslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    }
);
