var _ = require('lodash'),
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var PROXY_PROPERTIES = [
	'_ProxyProperty._Lists.HeaderView',
	'_ProxyProperty._Lists.FooterView',
	'_ProxyProperty._Lists.PullView',
	'_ProxyProperty._Lists.SearchView'
];
var SEARCH_PROPERTIES = [
	'Ti.UI.SearchBar',
	'Ti.UI.Android.SearchView'
];
var REFRESH_PROPERTY = 'Ti.UI.RefreshControl';
var VALID = [
	'Ti.UI.ListSection',
	'Alloy.Abstract.Templates',
	'Ti.UI.iOS.PreviewContext'
];
var ALL_VALID = _.union(PROXY_PROPERTIES, SEARCH_PROPERTIES, [REFRESH_PROPERTY], VALID);
var ORDER = {
	'Ti.UI.ListSection': 2,
	'Alloy.Abstract.Templates': 1
};

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var isDataBound = args[CONST.BIND_COLLECTION] ? true : false,
		code = '',
		proxyProperties = {},
		sectionArray, templateObject;

	if (isDataBound) {
		U.dieWithNode(node, "'dataCollection' attribute should be set on <ListSection>.");
	}

	// sort the children of the ListView
	var children = _.sortBy(U.XML.getElementsFromNodes(node.childNodes), function(n) {
		return ORDER[CU.validateNodeName(n, ALL_VALID)] || -1;
	});

	// process each child
	_.each(children, function(child) {
		var fullname = CU.getNodeFullname(child),
			theNode = CU.validateNodeName(child, ALL_VALID),
			isSearchBar = false,
			isRefreshControl = false,
			isProxyProperty = false,
			isControllerNode = false,
			hasUiNodes = false,
			parentSymbol, controllerSymbol;

		if (!theNode) {
			U.dieWithNode(child, 'Ti.UI.ListView child elements must be one of the following: [' +
				ALL_VALID.join(',') + ']');
		} else if (!CU.isNodeForCurrentPlatform(child)) {
			return;
		} else if (_.includes(CONST.CONTROLLER_NODES, fullname)) {
			isControllerNode = true;
		} else if (REFRESH_PROPERTY === theNode) {
			isRefreshControl = true;
		} else if (_.includes(SEARCH_PROPERTIES, theNode)) {
			isSearchBar = true;
		} else if (_.includes(PROXY_PROPERTIES, theNode)) {
			isProxyProperty = true;
		}

		// generate the node
		if (theNode !== 'Alloy.Abstract.Templates') {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					parentSymbol = state.parent.symbol;
					controllerSymbol = state.controller;
				}
			});
		}

		// manually handle controller node proxy properties
		if (isControllerNode) {

			// set up any proxy properties at the top-level of the controller
			var inspect = CU.inspectRequireNode(child);
			_.each(_.uniq(inspect.names), function(name) {
				if (_.includes(PROXY_PROPERTIES, name)) {
					var propertyName = U.proxyPropertyNameFromFullname(name);
					proxyProperties[propertyName] = controllerSymbol + '.getProxyPropertyEx("' + propertyName + '", {recurse:true})';
				} else {
					hasUiNodes = true;
				}
			});
		}

		// generate code for proxy property assignments
		if (isProxyProperty) {
			proxyProperties[U.proxyPropertyNameFromFullname(fullname)] = parentSymbol;

		// generate code for search bar
		} else if (isSearchBar) {
			proxyProperties.searchView = parentSymbol;

		// generate code for refreshControl
		} else if (isRefreshControl) {
			proxyProperties.refreshControl = parentSymbol;

		// generate code for ListSection
		} else if (theNode === 'Ti.UI.ListSection') {
			if (!sectionArray) {
				sectionArray = CU.generateUniqueId();
				code += 'var ' + sectionArray + '=[];';
			}
			code += sectionArray + '.push(' + parentSymbol + ');';

		// handle ItemTemplates
		} else if (theNode === 'Alloy.Abstract.Templates') {
			var templateNodes = U.XML.getElementsFromNodes(child.childNodes);
			_.each(templateNodes, function(template) {
				var fullname = CU.validateNodeName(template, 'Alloy.Abstract.ItemTemplate');
				if (!fullname) {
					U.dieWithNode(template, 'Child element must be one of the following: [Alloy.Abstract.ItemTemplate]');
				} else if (fullname === 'Alloy.Abstract.ItemTemplate') {
					if (!templateObject) {
						templateObject = CU.generateUniqueId();
						code += 'var ' + templateObject + '={};';
					}
					code += CU.generateNodeExtended(template, state, {
						parent: {},
						local: true,
						templateObject: templateObject
					});
				}
			});
			node.removeChild(child);
		}
	});

	// add all creation time properties to the state
	var extras = [];
	if (sectionArray) { extras.push(['sections', sectionArray]); }
	if (templateObject) { extras.push(['templates', templateObject]); }
	_.each(proxyProperties, function(v, k) {
		extras.push([k, v]);
	});
	// ALOY-1033: manually handle the case where the <SearchBar> is outside
	// the <ListView> and linked to the list via the searchView attribute
	if (node.hasAttribute('searchView')) {
		var attr = node.getAttribute('searchView');
		extras.push(['searchView', '$.__views.' + attr]);
		node.removeAttribute('searchView');
	}
	if (extras.length) { state.extraStyle = styler.createVariableStyle(extras); }

	// create the ListView itself
	var listState = require('./default').parse(node, state);
	code += listState.code;

	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}
