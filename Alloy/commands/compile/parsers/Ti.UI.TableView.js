var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		code = 'var ' + arrayName + ' = [];\n';

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// make sure we are dealing with rows and sections
		if (childArgs.fullname === 'Alloy.Require') {
			var inspect = CU.inspectRequireNode(child);
			_.each(inspect.names, function(name) {
				if (name !== 'Ti.UI.TableViewRow' &&
					name !== 'Ti.UI.TableViewSection') {
					U.die('TableView <Require> child at position ' + i + ' has elements that are not row(s) or section(s)');
				}
			});
		} else if (childArgs.fullname !== 'Ti.UI.TableViewRow' &&
				   childArgs.fullname !== 'Ti.UI.TableViewSection') {
			U.die('TableView child at position ' + i + ' is not a row or section, or a <Require> containing rows(s) or section(s).');
		}

		// generate code for the row/section
		code += CU.generateNode(child, {
			parent: {},
			styles: state.styles,
			post: function(node, state, args) {
				return arrayName + '.push(' + state.parent.symbol + ');\n';
			}
		});
	}

	// Create the initial TableView code
	state.extraStyle = CU.createVariableStyle('data', arrayName);
	var tableState = require('./default').parse(node, state);
	code += tableState.code;

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};