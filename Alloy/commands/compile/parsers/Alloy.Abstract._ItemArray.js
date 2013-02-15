var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants'); 

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
		} else if (!_.contains(def.children, childArgs.fullname)) {
			U.die('Invalid child of <' + node.nodeName + '> on line ' + child.lineNumber + ': ' + childArgs.fullname);
		} 
	});

	if (isCollectionBound) {
		var localModel = CU.generateUniqueId();
		var itemCode = '';

		_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
			itemCode += CU.generateNodeExtended(child, state, {
				parent: {},
				local: true,
				model: localModel,
				post: function(node, state, args) {
					return 'images.push(' + state.parent.symbol + ');\n';
				}
			});
		});

		code += _.template(CU.generateCollectionBindingTemplate(args), {
			localModel: localModel,
			pre: 'var images=[];',
			items: itemCode,
			post: "<%= itemContainer %>.images=images;"
		});

		return {
			parent: {},
			code: code
		}
	} 

	// return an empty state if we already processed
	if (def.children[0] === 'ALL') {
		return {
			parent: {},
			code: code
		};

	// return the current modified state if we need to continue processing
	} else {
		return _.extend(state, {
			parent: { node: node },
			code: code
		});
	}
}