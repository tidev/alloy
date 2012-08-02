var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	A$ = Alloy.A,
	$ = {
		parentController: Alloy.getController('BaseController')
	};

<%= controllerCode %>

var __extend = {
	__init: function() {
		$ = _.extend(this, $);
	},
	__layout: function() {
		<%= viewCode %>
	}
}

// TODO: make these assignments at compile time by manipulating 
//       the uglifyjs AST
__extend.parentController = $.parentController;
try { __extend.preLayout = preLayout; } catch(e) {}
try { __extend.postLayout = postLayout; } catch(e) {}

module.exports = __extend.parentController.extend(__extend);