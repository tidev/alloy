var U = require('../../../utils'),
	_ = require('lodash');

var LOCALE_REGEX = /^\s*(?:L|Ti\.Locale\.getString|Titanium\.Locale\.getString)\(.+\)\s*$/;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.itemsArray) {
		U.die('Invalid use of <Option>. Must be the child of <Options>.');
	}

	var string = U.trim(U.XML.getNodeText(node) || '');
	if (!LOCALE_REGEX.test(string)) {
		string = '"' + string.replace(/"/g, '\\"') + '"';
	}

	const codePush = `${state.itemsArray}.push(${string})`;
	const attrName = _.findKey(state.extraOptions, (varName, name) => args.createArgs[name] !== undefined);
	const attrVarName = state.extraOptions[attrName];

	let code = codePush;

	if (attrName) {
		if (args.createArgs[attrName]) {
			code = `${attrVarName} = ${codePush} - 1`;
		} else {
			code = `${attrVarName} = undefined; ${codePush}`;
		}
	}

	return {
		parent: {},
		styles: state.styles,
		code: `${code};`
	};
}
