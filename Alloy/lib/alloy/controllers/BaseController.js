var Alloy = require('alloy'), 
	Backbone = Alloy.Backbone,
	_ = Alloy._;

var Controller = function(args) {
	this.__iamalloy__ = true;
	this.root = undefined;
	if (this.__init) { this.__init(); }
	if (this.preLayout) { this.preLayout(args); }
	if (this.__layout) { this.__layout(); }
	if (this.postLayout) { this.postLayout(args); }
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