/**
 * Alloy for Titanium by Appcelerator
 * This is generated code, DO NOT MODIFY - changes will be lost!
 * Copyright (c) 2012 by Appcelerator, Inc.
 */
var Alloy = require('alloy'),
	_ = require('alloy/underscore')._;

Alloy.CFG = require('alloy/CFG');
Alloy.Models = {
<% _.each(models, function(name) {%>	<%= name %>: require('alloy/models/<%= name %>').Model, <% }); %>
};
Alloy.Collections = {
<% _.each(models, function(name) {%>	<%= name %>: require('alloy/models/<%= name %>').Collection, <% }); %>
};
(require('alloy/components/index')).create();
