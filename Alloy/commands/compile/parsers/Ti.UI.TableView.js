var _ = require('../../../lib/alloy/underscore')._,
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants'),
	logger = require('../../../logger');

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
var REFRESH_PROPERTY = 'Ti.UI.RefreshControl';
var VALID = [
	'Ti.UI.TableViewRow',
	'Ti.UI.TableViewSection'
];
var ALL_VALID = _.union(PROXY_PROPERTIES, SEARCH_PROPERTIES, [REFRESH_PROPERTY], VALID);

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
		localModel, arrayName, controllerSymbol;

	if(state.parentFormFactor || node.hasAttribute('formFactor')) {
		// if this node or a parent has set the formFactor attribute
		// we need to pass it to the data binding generator
		args.parentFormFactor = (state.parentFormFactor || node.getAttribute('formFactor'));
	}

	// iterate through all children of the TableView
	_.each(children, function(child) {
		var config = CU.getCompilerConfig(),
			platform = config && config.alloyConfig ? config.alloyConfig.platform : undefined;
		if (child.nodeName === 'SearchView' && platform !== 'android') {
			if (node.getAttribute('platform') !== 'android') {
				logger.warn([
					'<SearchView> is only available in Android',
					'To get rid of this warning, add platform="android" to your <SearchView> element'
				]);
			}
			return;
		}
		if(child.nodeName === 'SearchView' && !child.hasAttribute('ns')) {
			child.setAttribute('ns', 'Ti.UI.Android');
		}
		var fullname = CU.getNodeFullname(child),
			theNode = CU.validateNodeName(child, ALL_VALID),
			isSearchBar = false,
			isRefreshControl = false,
			isProxyProperty = false,
			isControllerNode = false,
			hasUiNodes = false;

		// validate the child element and determine if it's part of
		// the table data, a searchbar, or a proxy property assigment
		if (!theNode) {
			U.dieWithNode(child, 'Ti.UI.TableView child elements must be one of the following: [' + ALL_VALID.join(',') + ']');
		} else if (!CU.isNodeForCurrentPlatform(child)) {
			return;
		} else if (_.contains(CONST.CONTROLLER_NODES, fullname)) {
			isControllerNode = true;
		} else if (REFRESH_PROPERTY === theNode) {
			isRefreshControl = true;
		} else if (_.contains(SEARCH_PROPERTIES, theNode)) {
			isSearchBar = true;
		} else if (_.contains(PROXY_PROPERTIES, theNode)) {
			isProxyProperty = true;
		}

		// manually handle controller node proxy properties
		if (isControllerNode) {

			// set up any proxy properties at the top-level of the controller
			var inspect = CU.inspectRequireNode(child);
			_.each(_.uniq(inspect.names), function(name) {
				if (_.contains(PROXY_PROPERTIES, name)) {
					var propertyName = U.proxyPropertyNameFromFullname(name);
					proxyProperties[propertyName] = '<%= controllerSymbol %>.getProxyPropertyEx("' +
						propertyName + '", {recurse:true})';
				} else {
					hasUiNodes = true;
				}
			});
		}

		// generate code for proxy property assignments
		if (isProxyProperty) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, _state, _args) {
					if (_args.formFactor) {
						state.styles.push({
							isId: true,
							key: args.id,
							queries: { formFactor: _args.formFactor },
							style: styler.createVariableStyle(_state.propertyName, _state.parent.symbol)
						});
					} else {
						proxyProperties[U.proxyPropertyNameFromFullname(fullname)] = _state.parent.symbol;
					}
				}
			});

		// generate code for search bar
		} else if (isSearchBar) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					proxyProperties.search = state.parent.symbol;
				}
			});

		// generate code for refreshControl
		} else if (isRefreshControl) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					proxyProperties.refreshControl = state.parent.symbol;
				}
			});

		// are there UI elements yet to process?
		} else if (hasUiNodes || !isControllerNode) {

			// generate data binding code
			if (isDataBound) {
				localModel = localModel || CU.generateUniqueId();
				itemCode += CU.generateNodeExtended(child, state, {
					parent: {},
					local: true,
					model: localModel,
					post: function(node, state, args) {
						controllerSymbol = state.controller;
						return 'rows.push(' + state.parent.symbol + ');\n';
					}
				});

			// standard row/section processing
			} else {
				if (!arrayName) {
					arrayName = CU.generateUniqueId();
					code += 'var ' + arrayName + '=[];';
				}
				code += CU.generateNodeExtended(child, state, {
					parent: {},
					post: function(node, state, args) {
						controllerSymbol = state.controller;
						return arrayName + '.push(' + state.parent.symbol + ');';
					}
				});
			}

		// if there's no UI nodes inside, just generate it
		} else if (!hasUiNodes && isControllerNode) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					controllerSymbol = state.controller;
				}
			});
		}

		// fill in proxy property templates, if present
		if (isControllerNode) {
			_.each(proxyProperties, function(v,k) {
				proxyProperties[k] = _.template(v, {
					controllerSymbol: controllerSymbol
				});
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
