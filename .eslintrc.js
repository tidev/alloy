var OFF = 0;
var WARNING = 1;
var ERROR = 2;

module.exports = {
	env: {
		'node': true
	},

	extends: 'eslint:recommended',

	rules: {
		'brace-style': [ERROR, '1tbs', {'allowSingleLine': true}],
		'comma-spacing': [ERROR, {'before': false, 'after': true}],
		'indent': [ERROR, 'tab', {'SwitchCase': 1}],
		'keyword-spacing': ERROR,
		'linebreak-style': [ERROR, 'unix'],
		'no-fallthrough': OFF,
		'no-console': OFF,
		'no-cond-assign': OFF,
		'no-unused-vars': OFF,
		'no-undef': OFF,
		'no-octal': OFF,
		'quotes': [ERROR, 'single', {'avoidEscape': true, allowTemplateLiterals: true}],
		'space-before-blocks': [ERROR, 'always'],
		'space-infix-ops': [ERROR, {'int32Hint': false}],
		'semi': [ERROR, 'always']
	}
};