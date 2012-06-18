// TODO: Optimize out lifecycle events if they are not defined
//       instead of doing runtime checks

var Alloy = require("alloy"), 
	_ = Alloy._, 
	A$ = Alloy.A, 
	M$ = Alloy.M, 
	BC$ = Alloy.Backbone.Collection,
	U = require(''),
	Lifecycle = {};

<%= lifecycle %>

exports.create = function(args) {
	var $ = {};
	args = args || {};

	if (_.isFunction(Lifecycle.beforeCreate)) {
		Lifecycle.beforeCreate($);
	}

	// generated from view markup
	<%= viewCode %>

	// generated from controller
	<%= controllerCode %>

	if (_.isFunction(Lifecycle.afterCreate)) {
		Lifecycle.afterCreate($);
	}

	return $;
};