const toCheck = [ 'Alloy', '_', 'Backbone' ];
var template = require('@babel/template').default;

var buildRequire = template(`
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
				switch (node.arguments[0].value) {
					case '/alloy':
						this.imported.push('Alloy');
						break;
					case '/alloy/underscore':
						this.imported.push('_');
						break;
					case '/alloy/backbone':
						this.imported.push('Backbone');
						break;
				}
			},
			ImportDeclaration (path) {
				const node = path.node;
				if (!node.source || !node.source.value) {
					return;
				} 
				switch (node.source.value) {
					case '/alloy':
						this.imported.push('Alloy');
						break;
					case '/alloy/underscore':
						this.imported.push('_');
						break;
					case '/alloy/backbone':
						this.imported.push('Backbone');
						break;
				}
			},
			ReferencedIdentifier(path) {
				const node = path.node;
				if (toCheck.includes(node.name) && !this.required.includes(node.name) && !this.imported.includes(node.name) && !path.scope.hasBinding(node.name)) {
					this.required.push(node.name);
					switch (node.name) {
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
					this.imported = [];
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
