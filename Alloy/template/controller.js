// Controller Lifecycle
// --------------------
// init() --> __layout() --> controller()
//
// __layout() is performed by Alloy to create the view hierarchy.
// You should NOT define your own __layout() function.
//
// All functions defined in this controller will have access to 
// all IDed elements from the corresponding markup via the $ variable. 
// init() is the only exception. init() does NOT have access as it is 
// executed before the view hierarchy is established.

var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

// init() Quick Tips
// -----------------
// - Use init() to do any pre-layout configuration
// - init() is called before everything else. For this reason,
//   the $ variable does not yet have access to the IDed 
//   elements from the markup. You can however extend the $
//   variable, just as you can in controller()
function init(args) {
	$ = this;

	// add init code here
}

// controller() Quick Tips
// -----------------------
// - Access IDed markup elements via $ variable
//       `<View id="myview"/>` is accessed as `$.myview`
// - Expose properties and functions from the controller
//       $.myFunction = function(){};
//       $.customProperty = 123;
function controller(args) {
	// Add your controller code here
}