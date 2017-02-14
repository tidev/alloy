function myFunction() {
	return true;
}

$.label3.addEventListener('click', function() {
	var child = Alloy.createController('childWindow', { someProperty: true});
	console.log('__controllerPath = ' + child.__controllerPath);
	console.log('args = ' + JSON.stringify(child.args));
	child.getView().open();
});

$.index.open();