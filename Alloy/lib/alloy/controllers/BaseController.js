var Alloy = require('alloy'), 
	Backbone = Alloy.Backbone,
	_ = Alloy._;

var Controller = function() {
	var fixArgs = Array.prototype.slice.call(arguments);
	this.__iamalloy__ = true;
	//this.root = undefined;
	_.extend(this, Backbone.Events, {
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
	if (this.__init) { this.__init(); }
	if (this.preLayout) { this.preLayout.apply(this, fixArgs); }
	if (this.__layout) { this.__layout(); }
	if (this.__postLayout) { this.__postLayout.apply(this, fixArgs); }
}
//Controller.extend = Backbone.Model.extend;
// _.extend(Controller.prototype, Backbone.Events, {
// 	setParent: function(parent) {
// 		if (this.root) {
// 			parent.add(this.root);
// 		} 
// 	},
// 	setRoot: function(root) {
// 		this.root = root;
// 	},
// 	getRoot: function() {
// 		return this.root;
// 	}
// });
module.exports = Controller;
