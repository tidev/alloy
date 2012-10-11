var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

function fixDefinition(def) {
	def || (def = {});
	def.children || (def.children = []);
	def.translations || (def.translations = []);
	def.doRemoveNode = def.doRemoveNode || typeof(def.doRemoveNode) === 'undefined';
	return def;
}

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var def = fixDefinition(state.itemContainerDefinition),
		extras = [],
		code = '';

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var childArgs = CU.getParserArgs(child, state);
		
		// do translations
		_.each(def.translations, function(t) {
			if (childArgs.fullname === t.from) { 
				var match = t.to.match(/^(.+)\.(.+)$/);
				child.nodeName = match[2];
				child.setAttribute('ns', match[1]); 
			} 
		});
		
		// process item arrays if present
		var theNode = CU.validateNodeName(child, _.pluck(def.children, 'name'));
		if (_.find(def.children, function(c){ return c.name === theNode; })) {
			var childState = {
				parent: {},
				styles: state.styles,
				itemsArray: CU.generateUniqueId()
			};

			code += CU.generateNode(child, childState);
			var prop = _.find(def.children, function(c) { return c.name === theNode; }).property;
			extras.push([prop, childState.itemsArray]);

			// get rid of the node when we're done so we can pass the current state
			// back to generateNode() and then process any additional views that 
			// need to be added to the view hierarchy
			if (def.doRemoveNode) {
				node.removeChild(child);
			}
		}
	});

	if (extras.length) {	
		state.extraStyle = CU.createVariableStyle(extras);
	}
	var outState = require('./default').parse(node, state);
	code += outState.code;

	// Update the parsing state
	return _.extend(outState, {code:code}); 
};