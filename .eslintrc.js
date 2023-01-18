module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: [
		'airbnb-base'
	],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module'
	},
	rules: {
		'no-underscore-dangle': 'off',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: false,
				optionalDependencies: false,
				peerDependencies: false
			}
		],
		'no-empty': [
			'error',
			{
				allowEmptyCatch: true
			}
		],
		curly: [
			'error',
			'multi'
		],
		'max-len': [
			'error',
			{
				code: 180
			}
		],
		'no-unused-expressions': [
			'error',
			{
				allowTernary: true,
				allowShortCircuit: true
			}
		],
		'no-console': 'off',
		'no-return-assign': 'off',
		'no-plusplus': 'off',
		'consistent-return': 'off',
		'arrow-parens': 'off',
		'object-curly-spacing': [
			'error',
			'always'
		],
		'no-tabs': 'off',
		indent: [
			'error',
			'tab'
		],
		'operator-linebreak': [
			'error',
			'before'
		],
		'comma-dangle': [
			'error',
			'never'
		]
	}
};
