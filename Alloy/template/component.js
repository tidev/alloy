var A$ = require('alloy').A;

<%= controllerCode %>

function __layout() {
	var $ = this;
	<%= viewCode %>
}

// TODO: make these assignments at compile time by manipulating 
//       the uglifyjs AST
var x = { __layout: __layout };
try { x.preLayout = preLayout; } catch(e) {}
try { x.postLayout = postLayout; } catch(e) {}

module.exports = require('BaseController').extend(x);