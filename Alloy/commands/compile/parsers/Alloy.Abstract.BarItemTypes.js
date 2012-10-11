var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'); 

var VALID_PARENTS = [
	'Ti.UI.ButtonBar',
	'Ti.UI.iOS.TabbedBar'
];
var VALID_CHILDREN = [
	'Alloy.Abstract.BarItemType'
];
var TRANSLATIONS = [
	{ from: 'Ti.UI.Label', to: 'Alloy.Abstract.BarItemType' }
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.barItemTypesArray) {
		U.die([
			'Invalid use of <' + node.nodeName + '>.', 
			'Must be the child one of the following: [' + VALID_PARENTS.join(',') + ']'
		]);
	}

	// Translate the shorthand <Label> tag to <BarItemType>
	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child, index) {
		var childArgs = CU.getParserArgs(child, state);
		_.each(TRANSLATIONS, function(t) {
			if (childArgs.fullname === t.from) { 
				var match = t.to.match(/^(.+)\.(.+)$/);
				child.nodeName = match[2];
				child.setAttribute('ns', match[1]); 
			} else if (!_.contains(VALID_PARENTS, childArgs.fullname)) {
				U.die('Invalid type found at index ' + index + ' under <' + node.nodeName + '>: ' + childArgs.fullname);
			}
		});
	});

	return _.extend(state, {
		parent: { node: node },
		code: 'var ' + state.barItemTypesArray + ' = [];'
	});
}