var _ = require('../../../lib/alloy/underscore')._,
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var VALID = [
	'Ti.UI.ListSection',
	'Alloy.Abstract.Templates'
];
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
		sectionArray, templateObject;

	// sort the children of the ListView
	var children = _.sortBy(U.XML.getElementsFromNodes(node.childNodes), function(n) {
		return ORDER[CU.getNodeFullname(n)] || -1;
	});

	// process each child
	_.each(children, function(child) {
		var theNode = CU.validateNodeName(child, VALID);
		if (!theNode) {
			U.dieWithNode(child, 'Child element must be one of the following: [' + VALID.join(',') + ']');
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
		}
	});

	var extras = [];
	if (sectionArray) { extras.push(['sections', sectionArray]); }
	if (templateObject) { extras.push(['templates', templateObject]); }
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
