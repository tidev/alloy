// Use global reference to the collection. When changes occur in this
// collection reference, you'll notice that they also occur at the same
// time in tab_1, as they both make use of the global collection
// reference.
var myModels = Alloy.Collections.myModel;
var common = require('common');

function addItem(e) {
	common.addItem(myModels);
}

function removeItem(e) {
	common.removeItem(myModels, e.index);
}

if (OS_IOS || OS_MOBILEWEB) {
	common.prepNavBar($.window, addItem);
}

myModels.fetch();