var _ = require('../../../lib/alloy/underscore')._,
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var PROXY_PROPERTIES = [
	'_ProxyProperty._Lists.HeaderView',
	'_ProxyProperty._Lists.FooterView',
	'_ProxyProperty._Lists.HeaderPullView',
	'_ProxyProperty._Lists.Search'
];
var SEARCH_PROPERTIES = [
	'Ti.UI.SearchBar',
	'Ti.UI.Android.SearchView'
];
var VALID = [
	'Ti.UI.TableViewRow',
	'Ti.UI.TableViewSection'
];
var ALL_VALID = _.union(PROXY_PROPERTIES, SEARCH_PROPERTIES, VALID);

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		code = '',
		itemCode = '',
		isDataBound = args[CONST.BIND_COLLECTION] ? true : false,
		extras = [],
		proxyProperties = {},
		localModel, arrayName;

	// iterate through all children of the TableView
	_.each(children, function(child) {
		var childArgs = CU.getParserArgs(child),
			isSearchBar = false,
			isProxyProperty = false;

		// validate the child element and determine if it's part of
		// the table data, a searchbar, or a proxy property assigment
		var theNode = CU.validateNodeName(child, ALL_VALID);
		if (!theNode) {
			U.dieWithNode(child, 'Ti.UI.TableView child elements must be one of the following: [' + ALL_VALID.join(',') + ']');
		} else if (_.contains(SEARCH_PROPERTIES, theNode)) {
			isSearchBar = true;
		} else if (_.contains(PROXY_PROPERTIES, theNode)) {
			isProxyProperty = true;
		}

		// generate code for proxy property assignments
		if (isProxyProperty) {
			if (!CU.isNodeForCurrentPlatform(child)) {
				return;
			}
			var nameParts = theNode.split('.');
			var prop = U.lcfirst(nameParts[nameParts.length-1]);
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					proxyProperties[prop] = state.parent.symbol;
				}
			});
		// generate code for search bar
		} else if (isSearchBar) {
			if (!CU.isNodeForCurrentPlatform(child)) {
				return;
			}
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					proxyProperties.search = state.parent.symbol;
				}
			});
		// generate code for template row for model-view binding
		} else if (isDataBound) {
			localModel = localModel || CU.generateUniqueId();
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

	// add data at creation time
	if (arrayName) { extras.push(['data', arrayName]); }

	// add all proxy properties at creation time
	_.each(proxyProperties, function(v, k) {
		extras.push([k, v]);
	});

	// if we got any extras, add them to the state
	if (extras.length) { state.extraStyle = styler.createVariableStyle(extras); }

	// generate the code for the table itself
	if (isDataBound) {
		_.each(CONST.BIND_PROPERTIES, function(p) {
			node.removeAttribute(p);
		});
	}
	var tableState = require('./default').parse(node, state);
	code += tableState.code;

	// finally, fill in any model-view binding code, if present
	if (isDataBound) {
		localModel = localModel || CU.generateUniqueId();
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
	};
}
