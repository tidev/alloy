var Alloy = require("alloy"), 
	_ = Alloy._;

exports.create = function() {
	var L$ = {},
		root$;

	var $ = {
		addEventListener: function(evt,callback) {
			if (!L$[evt]) {
				L$[evt] = [];
			}
			L$[evt].push(callback);
		},
		fireEvent: function(evt,object) {
			if (_.isArray(L$[evt])) {
				for (var i = 0, l = L$[evt].length; i < l; i++) {
					L$[evt][i](object);
				}
			}
		},
		removeEventListener: function(evt,callback) {
			if (_.isArray(L$[evt])) {
				L$[evt] = _.without(L$[evt], callback);
			}
		},
		setParent: function(parent) {
			if (root$) {
				parent.add(root$);
			} 
		},
		getRoot: function() {
			return root$;
		},
		setRoot: function(root) {
			root$ = root;
		}
	};

	// event shorthand methods
	$.on = $.addEventListener;
	$.off = $.removeEventListener;
	$.trigger = $.fireEvent;

	return $;
};