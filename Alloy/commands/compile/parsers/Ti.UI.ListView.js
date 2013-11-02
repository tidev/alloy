var _ = require('../../../lib/alloy/underscore')._,
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
var VALID = [
	'Ti.UI.ListSection',
	'Alloy.Abstract.Templates',
];
var ALL_VALID = _.union(PROXY_PROPERTIES, SEARCH_PROPERTIES, VALID);
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

	// sort the children of the ListView
	var children = _.sortBy(U.XML.getElementsFromNodes(node.childNodes), function(n) {
		return ORDER[CU.getNodeFullname(n)] || -1;
	});

	// process each child
	_.each(children, function(child) {
		var theNode = CU.validateNodeName(child, ALL_VALID);
		if (!theNode) {
			U.dieWithNode(child, 'Ti.UI.ListView child elements must be one of the following: [' + ALL_VALID.join(',') + ']');
		} else if (theNode === 'Ti.UI.ListSection') {
			if (!sectionArray) {
				sectionArray = CU.generateUniqueId();
				code += 'var ' + sectionArray + '=[];';
			}
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					return sectionArray + '.push(' + state.parent.symbol + ');';
				}
			});
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
		} else if (_.contains(PROXY_PROPERTIES, theNode)) {
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
		} else if (_.contains(SEARCH_PROPERTIES, theNode)) {
			if (!CU.isNodeForCurrentPlatform(child)) {
				return;
			}
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					proxyProperties.searchView = state.parent.symbol;
				}
			});
		}
	});

	// add all creation time properties to the state
	var extras = [];
	if (sectionArray) { extras.push(['sections', sectionArray]); }
	if (templateObject) { extras.push(['templates', templateObject]); }
	_.each(proxyProperties, function(v, k) {
		extras.push([k, v]);
	});
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
