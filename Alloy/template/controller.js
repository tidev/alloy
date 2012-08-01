var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._;

// controller() Quick Tips
// -----------------------
// - Access IDed markup elements via $ variable
//       `<View id="myview"/>` is accessed as `$.myview`
// - Expose properties and functions from the controller
//       $.myFunction = function(){};
//       $.customProperty = 123;
function controller(args) {
	var $ = this; 

	// Add your controller code here
}

// Uncomment beforeLayout() to utilize this lifecycle function. For reference,
// the order of execution is:
//
//     beforeLayout() -> __layout() (done by Alloy) -> controller()
//
// Be aware that you will not have access to the IDed markup via $ yet as
// beforeLayout() is executed before Alloy creates the view hierarchy.
//
// function beforeLayout(args) {}