var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'); 

function fixDefinition(def) {
	def || (def = {});
	def.parents || (def.parents = []);
	def.children || (def.children = []);
	def.translations || (def.translations = []);
	return def;
}

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var def = fixDefinition(state.itemArrayDefinition);

	// Ensure that this _ItemArray has an appropriate parent based on the given
	// array key name
	if (!state.itemsArray) {
		U.die([
			'Invalid use of <' + node.nodeName + '> at line ' + node.lineNumber, 
			'Must be the child one of the following: [' + def.parents.join(',') + ']'
		]);
	}

	// Run the translations and/or validations
	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var childArgs = CU.getParserArgs(child, state);
		_.each(def.translations, function(t) {
			if (childArgs.fullname === t.from) { 
				var match = t.to.match(/^(.+)\.(.+)$/);
				child.nodeName = match[2];
				child.setAttribute('ns', match[1]); 
			} else if (!_.contains(def.parents, childArgs.fullname)) {
				U.die('Invalid child of <' + node.nodeName + '> on line ' + child.lineNumber + ': ' + childArgs.fullname);
			}
		});
	});

	return _.extend(state, {
		parent: { node: node },
		code: 'var ' + state.itemsArray + ' = [];'
	});
}