var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	logger = require('../../../common/logger');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var types = {
			options: {},
			buttonNames: {}
		},
		config = CU.getCompilerConfig(),
		isAndroid = config && config.alloyConfig && config.alloyConfig.platform === 'android',
		androidView = null,
		extras = [],
		code = '';

	// Add properties for types
	_.each(_.keys(types), function(key) {
		var uc = U.ucfirst(key);
		types[key] = {
			collection: uc,
			item: uc.substr(0,uc.length-1),
			array: CU.generateUniqueId(),
			first: true
		};
	});

	// Process options, buttonNames, and androidView
	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var typeName = U.lcfirst(child.nodeName);
		var def = types[typeName];

		// Process options and buttonNames
		if (def && !child.getAttribute('ns')) {
			_.each(U.XML.getElementsFromNodes(child.childNodes), function(item, index) {
				if (item.nodeName === def.item && !item.getAttribute('ns')) {
					var string = U.trim(U.XML.getNodeText(item) || '');
					if (def.first) { 
						def.first = false;
						code += 'var ' + def.array + ' = [];'; 
						extras.push([typeName, def.array]);
					}
					code += def.array + '.push("' + string.replace(/"/g,'\\"') + '");\n';
				} else {
					U.die('Child element of OptionDialog\'s <' + def.collection + '> at index ' + index + ' is not a <' + def.item + '>');
				}
			});

			// get rid of the items when done
			node.removeChild(child);

		// Process a potential androidView
		} else {
			if (androidView === null) {
				var tmpExtra = [];
				androidView = CU.generateNode(child, {
					parent: {},
					styles: state.styles,
					post: function(node, state, args) {
						tmpExtra.push(['androidView', state.parent.symbol]);
					}
				});

				if (isAndroid) {
					code += androidView;
					extras = _.union(extras, tmpExtra);
				}
			} else {
				U.die('Can only have one androidView');
			}	
		}
	});

	// Add options and button names to the style, if present
	if (extras.length) {	
		state.extraStyle = CU.createVariableStyle(extras);
	}
	state.parent = {};

	var optionState = require('./default').parse(node, state);
	code += optionState.code;

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
};