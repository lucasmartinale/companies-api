// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['eslint.config.mjs'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: 'commonjs',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			quotes: ['error', 'single', 'avoid-escape'],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/adjacent-overload-signatures': 'warn',
			'@typescript-eslint/array-type': ['error', { default: 'array' }],
			'@typescript-eslint/await-thenable': 'warn',
			'@typescript-eslint/ban-ts-comment': 'error',
			'@typescript-eslint/ban-tslint-comment': 'error',
			'@typescript-eslint/class-literal-property-style': 'off',
			'@typescript-eslint/consistent-generic-constructors': ['warn', 'type-annotation'],
			'@typescript-eslint/consistent-indexed-object-style': 'off',
			'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
			'@typescript-eslint/consistent-type-exports': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'off' } }],
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/member-ordering': 'off',
			'@typescript-eslint/method-signature-style': ['error', 'method'],
			'@typescript-eslint/no-base-to-string': 'error',
			'@typescript-eslint/no-confusing-non-null-assertion': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'@typescript-eslint/no-duplicate-enum-values': 'error',
			'@typescript-eslint/no-dynamic-delete': 'error',
			'@typescript-eslint/no-empty-interface': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-extra-non-null-assertion': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-for-in-array': 'off',
			'@typescript-eslint/no-inferrable-types': 'error',
			'@typescript-eslint/no-invalid-void-type': 'error',
			'@typescript-eslint/no-meaningless-void-operator': 'error',
			'no-restricted-syntax': [
				'error',
				{
					selector: 'ExportDefaultDeclaration',
					message: 'Prefer named exports',
				},
			],
			'require-await': 'off',
			'@typescript-eslint/require-await': 'error',
			'no-duplicate-imports': 'error',
			'@typescript-eslint/no-unnecessary-condition': 'error',
			'no-shadow': 'off',
			"@typescript-eslint/unbound-method": "off",
			'@typescript-eslint/no-shadow': 'error',
			'no-nested-ternary': 'error',
			"prettier/prettier": [
				"error",
				{
					"endOfLine": "auto"
				}
			]
		},
	},
);


