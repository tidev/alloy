var _ = require('lodash'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

function fixDefinition(def) {
	def = def || {};
	def = _.defaults(def, {
		parents: [],
		children: [],
		translations: [],
		property: 'items'
	});
	return def;
}

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var def = fixDefinition(state.itemArrayDefinition);

	// Ensure that this _ItemArray has an appropriate parent
	if (!state.itemsArray) {
		U.die([
			'Invalid use of <' + node.nodeName + '> at line ' + node.lineNumber,
			'Must be the child one of the following: [' + def.parents.join(',') + ']'
		]);
	}

	var children = U.XML.getElementsFromNodes(node.childNodes);
	var isCollectionBound = args[CONST.BIND_COLLECTION] ? true : false;
	var code = children.length ? 'var ' + state.itemsArray + ' = [];' : '';

	if (node.parentNode.nodeName === 'MenuPopup') {
		def.children[0] = 'Alloy.Abstract.Item';
	}

	// Run the translations and/or validations
	_.each(children, function(child) {
		var childArgs = CU.getParserArgs(child, state);
		_.each(def.translations, function(t) {
			if (childArgs.fullname === t.from) {
				var match = t.to.match(/^(.+)\.(.+)$/);
				child.nodeName = match[2];
				child.setAttribute('ns', match[1]);
				_.extend(childArgs, {
					fullname: t.to,
					name: match[2],
					ns: match[1]
				});
			}
		});

		// This ItemArray processes all types
		if (def.children[0] === 'ALL') {
			if (!isCollectionBound) {
				code += CU.generateNodeExtended(child, state, {
					parent: {},
					post: function(node, s, args) {
						return state.itemsArray + '.push(' + s.parent.symbol + ');';
					}
				});
			}

		// Make sure the children match the parent
		} else if (!_.includes(def.children, childArgs.fullname)) {
			U.die('Invalid child of <' + node.nodeName + '> on line ' + child.lineNumber + ': ' + childArgs.fullname);
		}
	});

	if (isCollectionBound) {
		var localModel = CU.generateUniqueId();
		var itemCode = '';
		var itemsVar = CU.generateUniqueId();

		_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
			itemCode += CU.generateNodeExtended(child, state, {
				parent: {},
				local: true,
				model: localModel,
				post: function(node, state, args) {
					return itemsVar + '.push(' + state.parent.symbol + ');\n';
				}
			});
		});

		if (state.parentFormFactor || node.hasAttribute('formFactor')) {
			// if this node or a parent has set the formFactor attribute
			// we need to pass it to the data binding generator
			args.parentFormFactor = (state.parentFormFactor || node.getAttribute('formFactor'));
		}
		code += _.template(CU.generateCollectionBindingTemplate(args))({
			localModel: localModel,
			pre: 'var ' + itemsVar + '=[];',
			items: itemCode,
			post: '<%= itemContainer %>.' + def.property + '=' + itemsVar + ';'
		});

		return {
			parent: {},
			code: code
		};
	}

	// return an empty state if we already processed
	if (def.children[0] === 'ALL') {
		if (state.property === 'leftNavButtons' || state.property === 'rightNavButtons' || state.property === 'toolbar') {
			code += ((state.parent && state.parent.symbol ? state.parent.symbol : CONST.PARENT_SYMBOL_VAR) + '.' + state.property + ' = ' + state.itemsArray + ';');
		}
		return {
			parent: {},
			code: code
		};

	// return the current modified state if we need to continue processing
	} else {
		return _.extend(state, {
			isCollectionBound: isCollectionBound,
			parent: { node: node },
			code: code
		});
	}
}
