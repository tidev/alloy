var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var PROXY_PROPERTIES = [
	'Ti.UI.TableView.HeaderView',
	'Ti.UI.TableView.HeaderPullView',
	'Ti.UI.TableView.FooterView',
	'Ti.UI.TableView.Search'
];
var VALID = [
	'Ti.UI.TableViewRow',
	'Ti.UI.TableViewSection',
	'Ti.UI.SearchBar'
];
var ALL_VALID = _.union(PROXY_PROPERTIES, VALID);

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		localModel = CU.generateUniqueId(),
		code = '',
		proxyPropertyCode = '',
		hasRows = false,
		searchBarName,
		proxyProperties = [];

	// are we using collection binding with this table?
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

		// Do we use an instance or singleton collection reference?
		var col;
		if (args[CONST.BIND_COLLECTION].indexOf('$.') === 0) {
			col = args[CONST.BIND_COLLECTION];
		} else {
			col = 'Alloy.Collections[\'' + args[CONST.BIND_COLLECTION] + '\']';
		} 
		
		// create fetch/change handler
		var whereCode = where ? where + "(" + col + ")" : col + ".models";
		var transformCode = transform ? transform + "(" + localModel + ")" : "{}";
		code += col + ".on('fetch change add remove', function(e) { ";
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
				childArgs = CU.getParserArgs(child),
				isSearchBar = false,
				isProxyProperty = false;

			// validate the child element and determine if it's part of
			// the table data, a searchbar, or a proxy property assigment
			var theNode = CU.validateNodeName(child, ALL_VALID);
			if (!theNode) {
				U.dieWithNode(child, 'Child element must be on of the following: [' + ALL_VALID.join(',') + ']');
			} else if (theNode === 'Ti.UI.SearchBar') {
				isSearchBar = true;
			} else if (_.contains(PROXY_PROPERTIES, theNode)) {
				isProxyProperty = true;
			}

			// make sure we are dealing with rows and sections
			// if (childArgs.fullname === 'Alloy.Require') {
			// 	var inspect = CU.inspectRequireNode(child);
			// 	_.each(inspect.names, function(name) {
			// 		if (name === 'Ti.UI.TableViewRow' ||
			// 			name === 'Ti.UI.TableViewSection') {
			// 			isSearchBar = false;
			// 		} else if (name === 'Ti.UI.SearchBar') {
			// 			isSearchBar = true;
			// 		} else {
			// 			U.die('TableView <Require> child at position ' + i + ' has elements that are not rows, sections, or SearchBar');
			// 		}
			// 	});
			// } else if (childArgs.fullname === 'Ti.UI.TableViewRow' ||
			// 		   childArgs.fullname === 'Ti.UI.TableViewSection') {
			// 	isSearchBar = false;
			// } else if (childArgs.fullname === 'Ti.UI.SearchBar') {
			// 	isSearchBar = true;
			// } else {
			// 	U.die('TableView child at position ' + i + ' is not a row or section, or a <Require> containing rows, sections, or SearchBar');
			// }

			
			if (isProxyProperty) {
				// generate code for proxy property assigments
				proxyPropertyCode += CU.generateNode(child, {
					parent: { 
						node: node, 
						symbol: '<%= proxyPropertyParent %>' 
					},
					styles: state.styles
				});
			} else {
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
		}

		// Create the initial TableView code
		var extras = [];
		if (hasRows) { extras.push(['data', arrayName]); }
		if (searchBarName) { extras.push(['search', searchBarName]) }
		if (extras.length) { state.extraStyle = CU.createVariableStyle(extras); }

		// generate the code for the table itself
		var tableState = require('./default').parse(node, state);
		code += tableState.code;

		// fill in the proxy property assignment template with the
		// symbol used to represent the table
		code += _.template(proxyPropertyCode, {proxyPropertyParent:tableState.parent.symbol});
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};
