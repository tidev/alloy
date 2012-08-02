var A$ = require('alloy').A;

<%= controllerCode %>

function __layout() {
	var $ = this;
	<%= viewCode %>
}

// TODO: make these assignments at compile time by manipulating 
//       the uglifyjs AST
var x = { __layout: __layout };
try { x.__init = init; } catch(e) {}
try { x.__controller = controller; } catch(e) {}

module.exports = require('BaseController').extend(x);