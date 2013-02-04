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
		code = '',
		proxyPropertyCode = '',
		itemCode = '',
		isDataBound = args[CONST.BIND_COLLECTION] ? true : false,
		searchBarName, localModel, arrayName;

	// iterate through all children of the TableView
	_.each(children, function(child) {
		var childArgs = CU.getParserArgs(child),
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

		// generate code for proxy property assigments
		if (isProxyProperty) {
			proxyPropertyCode += CU.generateNodeExtended(child, state, {
				parent: {
					node: node,
					symbol: '<%= proxyPropertyParent %>'
				}
			});
		// generate code for search bar
		} else if (isSearchBar) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					searchBarName = state.parent.symbol;
				}
			});
		// generate code for template row for model-view binding
		} else if (isDataBound) {
			localModel || (localModel = CU.generateUniqueId());
			itemCode += CU.generateNodeExtended(child, state, {
				parent: {},
				local: true,
				model: localModel,
				post: function(node, state, args) {
					return 'rows.push(' + state.parent.symbol + ');\n';
				}
			});
		// generate code for the static row/section/searchbar
		} else {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					var postCode = '';
					if (!arrayName) {
						arrayName = CU.generateUniqueId();
						postCode += 'var ' + arrayName + '=[];';
					}
					postCode += arrayName + '.push(' + state.parent.symbol + ');';
					return postCode;
				}
			});
		}
	});

	// Create the initial TableView code
	var extras = [];
	if (arrayName) { extras.push(['data', arrayName]); }
	if (searchBarName) { extras.push(['search', searchBarName]) }
	if (extras.length) { state.extraStyle = CU.createVariableStyle(extras); }

	// generate the code for the table itself
	if (isDataBound) {
		_.each(CONST.BIND_PROPERTIES, function(p) {
			node.removeAttribute(p);
		});
	}
	var tableState = require('./default').parse(node, state);
	code += tableState.code;

	// fill in the proxy property assignment template with the
	// symbol used to represent the table
	code += _.template(proxyPropertyCode, {
		proxyPropertyParent: tableState.parent.symbol
	});

	// finally, fill in any model-view binding code, if present
	if (isDataBound) {
		localModel || (localModel = CU.generateUniqueId());
		code += _.template(CU.generateCollectionBindingTemplate(args), {
			localModel: localModel,
			pre: "var rows=[];",
			items: itemCode,
			post: tableState.parent.symbol + ".setData(rows);"
		});
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
}
