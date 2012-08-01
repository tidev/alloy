var A$ = require('alloy').A;

<%= controllerCode %>

function __layout() {
	var $ = this;
	<%= viewCode %>
}

var x = { __layout: __layout };
if (_.isFunction(beforeLayout)) { x.beforeLayout = beforeLayout; }
if (_.isFunction(controller)) { x.controller = controller; }

var BaseController = require('BaseController');
var Controller = BaseController.extend(x);
module.exports = Controller;