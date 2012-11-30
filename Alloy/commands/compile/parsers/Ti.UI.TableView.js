var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		localModel = CU.generateUniqueId(),
		code = '',
		isSearchBar = false,
		hasRows = false,
		searchBarName;

	if (args[CONST.BIND_COLLECTION]) {
		var where = args[CONST.BIND_WHERE];
		var transform = args[CONST.BIND_TRANSFORM];
		var tableState = require('./default').parse(node, state);
		code += tableState.code;

		// iterate through all children
		var itemCode = '';
		for (var i = 0, l = children.length; i < l; i++) {
			var child = children[i],
				childArgs = CU.getParserArgs(child);

			// TODO: validate children of tableview

			itemCode += CU.generateNode(child, {
				parent: {},
				local: true,
				model: localModel,
				styles: state.styles,
				post: function(node, state, args) {
					return 'rows.push(' + state.parent.symbol + ');\n';
				}
			});
		}

		// create fetch/change handler
		var col = 'Alloy.Collections[\'' + args[CONST.BIND_COLLECTION] + '\']';
		var whereCode = where ? where + "(" + col + ")" : col + ".models";
		var transformCode = transform ? transform + "(" + localModel + ")" : "{}";
		code += col + ".on('fetch change', function(e) { ";
		code += "	var models = " + whereCode + ";";
		code += "	var len = models.length;";
		code += "	var rows = [];";
		code += "	for (var i = 0; i < len; i++) {";
		code += "		var " + localModel + " = models[i];";
		code += "		" + localModel + ".__transform = " + transformCode + ";";
		code += itemCode;
		code += "	}";
		code += tableState.parent.symbol + ".setData(rows);";
		code += "});";
	} else {
		code = 'var ' + arrayName + ' = [];\n';

		// iterate through all children
		for (var i = 0, l = children.length; i < l; i++) {
			var child = children[i],
				childArgs = CU.getParserArgs(child);

			// make sure we are dealing with rows and sections
			if (childArgs.fullname === 'Alloy.Require') {
				var inspect = CU.inspectRequireNode(child);
				_.each(inspect.names, function(name) {
					if (name === 'Ti.UI.TableViewRow' ||
						name === 'Ti.UI.TableViewSection') {
						isSearchBar = false;
					} else if (name === 'Ti.UI.SearchBar') {
						isSearchBar = true;
					} else {
						U.die('TableView <Require> child at position ' + i + ' has elements that are not rows, sections, or SearchBar');
					}
				});
			} else if (childArgs.fullname === 'Ti.UI.TableViewRow' ||
					   childArgs.fullname === 'Ti.UI.TableViewSection') {
				isSearchBar = false;
			} else if (childArgs.fullname === 'Ti.UI.SearchBar') {
				isSearchBar = true;
			} else {
				U.die('TableView child at position ' + i + ' is not a row or section, or a <Require> containing rows, sections, or SearchBar');
			}

			// generate code for the row/section/searchbar
			code += CU.generateNode(child, {
				parent: {},
				styles: state.styles,
				post: function(node, state, args) {
					if (isSearchBar) {
						searchBarName = state.parent.symbol;
					} else {
						hasRows = true;
						return arrayName + '.push(' + state.parent.symbol + ');\n';
					}
				}
			});
		}

		// Create the initial TableView code
		var extras = [];
		if (hasRows) { extras.push(['data', arrayName]); }
		if (searchBarName) { extras.push(['search', searchBarName]) }
		if (extras.length) { state.extraStyle = CU.createVariableStyle(extras); }

		var tableState = require('./default').parse(node, state);
		code += tableState.code;
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};
