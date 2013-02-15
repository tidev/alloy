var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	logger = require('../../../common/logger');

function fixDefinition(def) {
	def || (def = {});
	def.children || (def.children = []);
	def.translations || (def.translations = []);
	def.doRemoveNode = def.doRemoveNode || typeof(def.doRemoveNode) === 'undefined';
	def.processOthers = def.processOthers || function(){};
	def.inViewHierarchy = def.inViewHierarchy || typeof(def.inViewHierarchy) === 'undefined';
	return def;
}

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var def = fixDefinition(state.itemContainerDefinition),
		config = CU.getCompilerConfig(),
		isAndroid = config && config.alloyConfig && config.alloyConfig.platform === 'android',
		androidView = null;
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
				itemsArray: CU.generateUniqueId()
			};

			code += CU.generateNodeExtended(child, state, childState);
			var prop = _.find(def.children, function(c) { return c.name === theNode; }).property;
			extras.push([prop, childState.itemsArray]);

			// get rid of the node when we're done so we can pass the current state
			// back to generateNode() and then process any additional views that 
			// need to be added to the view hierarchy
			if (def.doRemoveNode) {
				node.removeChild(child);
			}

		// process potential androidView if defined
		} else if (def.androidView) {
			if (androidView === null) {
				if (isAndroid) {
					androidView = CU.generateNodeExtended(child, state, {
						parent: {},
						post: function(node, state, args) {
							extras.push(['androidView', state.parent.symbol]);
						}
					});
					code += androidView;
				} else {
					logger.warn('Additional views in ' + theNode + ' only supported on Android');
				}
			} else {
				U.die(theNode + ' can only have one androidView');
			}
		}
	});

	if (extras.length) {	
		state.extraStyle = CU.createVariableStyle(extras);
	}
	if (!def.inViewHierarchy) {
		state.parent = {};
	}

	var outState = require('./default').parse(node, state);
	code = _.template(code, {
		itemContainer: outState.parent.symbol
	});
	code += outState.code;

	// Update the parsing state
	return _.extend(outState, {code:code});
	 
};