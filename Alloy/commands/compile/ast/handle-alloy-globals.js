const ALLOY_GLOBALS_TO_CHECK = [ 'Alloy', '_', 'Backbone' ];
const template = require('@babel/template').default;

const buildRequire = template(`
	var VARIABLE = REQUIRECALL;
`);
module.exports = function(babel) {
	return {
		name: 'app.js top level variables global transform',
		visitor: {
			CallExpression: function (path, state) {
				const node = path.node;
				if (node.callee.name !== 'require') {
					return;
				}
				if (!node.arguments || !node.arguments[0]) {
					return;
				}
				checkStatement(node.arguments[0].value, state);
			},
			ImportDeclaration (path) {
				const node = path.node;
				if (!node.source || !node.source.value) {
					return;
				}
				checkStatement(node.source.value, state);
			},
			ReferencedIdentifier(path) {
				const name = path.name;
				if (ALLOY_GLOBALS_TO_CHECK.includes(name) // Is this identifier one of the special 3
					&& !this.required.includes(name) // Have we already imported it
					&& !path.scope.hasBinding(name) // Does this binding already exist in the scope? (e.g user might import lodash as _ which we don't want to override)
				) {
					this.required.push(name);
					switch (name) {
						case 'Alloy':
							this.toRequire.push({
								VARIABLE: 'Alloy',
								REQUIRECALL: 'require(\'/alloy\')'
							});
							break;
						case '_':
							this.toRequire.push({
								VARIABLE: '_',
								REQUIRECALL: 'require(\'/alloy/underscore\')._'
							});
							break;
						case 'Backbone':
							this.toRequire.push({
								VARIABLE: 'Backbone',
								REQUIRECALL: 'require(\'/alloy/backbone\')'
							});
							break;
					}
					
				}
			},
			Program: {
				enter() {
					this.toRequire = [];
					this.required = [];
				},

				exit(path) {
					if (this.toRequire.length) {
						for (const data of this.toRequire) {
							path.unshiftContainer('body', [
								buildRequire(data)
							]);
						}
					}
				}
			}
		}
	};
};

/**
 *
 * @param {String} moduleName - Module name in the import or require statement
 * @param {Object} state - Babel state object
 */
function checkStatement(moduleName, state) {
	switch (moduleName) {
		case 'alloy':
		case '/alloy':
			state.required.push('Alloy');
			break;
		case 'alloy/underscore':
		case '/alloy/underscore':
			state.required.push('_');
			break;
		case 'alloy/backbone':
		case '/alloy/backbone':
			state.required.push('Backbone');
			break;
	}
}
