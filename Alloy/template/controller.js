// Change parentController if you want to inherit from a different
// controller. In most cases you'll leave this as it is. You can
// also delete it and 'BaseController' will be used by default.
$.parentController = Alloy.getController('BaseController');

function preLayout(args) {
	// add your code here
}

function postLayout(args) {
	// Add your code here
}

// Controller Lifecycle
// --------------------
// __init() --> preLayout() --> __layout() --> postLayout()
//
//  __init: [AUTO-GENERATED]
//          Created by Alloy at compile time. Sets context of the $
//          variable. Don't define your own __init() function, 
//          you'll break stuff.
//
//  preLayout: [optional] 
//             Code that needs to be executed before the view
//             hierarchy is established. Not needed in most cases.
//             The $ variable does not yet have access to IDed 
//             elements from the view hierarchy yet. 
//
//  __layout: [AUTO-GENERATED]
//            Created by Alloy at compile time. Creates the view
//            hierarchy code based on your corresponding markup.
//            Like __init(), don't define your own. 
//
//  postLayout: [optional]
//              Your primary coding area. This code is executed 
//              after all Alloy initialization and your markup's
//              view hierarchy is created. All IDed elements from
//              your markup are accessible from the $ variable.