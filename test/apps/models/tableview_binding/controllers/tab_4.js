// Use local reference to collection, attached to this controller. Notice that
// when changes are made to this local collection reference, they are not
// automatically reflected in the runtime state of other references to this
// collection. The back-end persistence state is identical among all references,
// but the current runtime state is dependent on the reference instance. 
var myModels = $.myModelId;
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

myModels.comparator = common.comparator;
myModels.fetch();