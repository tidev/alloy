var Alloy = require("alloy"), 
	Backbone = Alloy.Backbone,
	_ = Alloy._;

var Controller = function(args) {
	this.__iamalloy__ = true;
	this.root = undefined;
	if (this.beforeLayout) { this.beforeLayout(args); }
	if (this.__layout) { this.__layout(args); }
	if (this.controller) { this.controller(args); }
}
Controller.extend = Backbone.Model.extend;
_.extend(Controller.prototype, Backbone.Events, {
	setParent: function(parent) {
		if (this.root) {
			parent.add(this.root);
		} 
	},
	setRoot: function(root) {
		this.root = root;
	},
	getRoot: function() {
		return this.root;
	}
});

module.exports = Controller;