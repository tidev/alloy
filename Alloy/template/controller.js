// Controller Lifecycle
// --------------------
// preLayout() --> __layout() --> postLayout()
//
// __layout() is created by Alloy to create the view hierarchy.
// You should NOT define your own __layout() function.
//
// All functions defined in this controller will have access to 
// all IDed elements from the corresponding markup via the $ variable. 
// preLayout() is the only exception. preLayout() does NOT have access 
// as it is executed before the view hierarchy is established.

var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

// preLayout() Quick Tips
// -----------------
// - Use preLayout() to do any pre-layout configuration
// - preLayout() is called before everything else. For this reason,
//   the $ variable does not yet have access to the IDed 
//   elements from the markup. You can however extend the $
//   variable, just as you can in controller()
function preLayout(args) {
	$ = this;

	// add init code here
}

// postLayout() Quick Tips
// -----------------------
// - Access IDed markup elements via $ variable
//       `<View id="myview"/>` is accessed as `$.myview`
// - Expose properties and functions from the controller
//       $.myFunction = function(){};
//       $.customProperty = 123;
function postLayout(args) {
	// Add your controller code here
}