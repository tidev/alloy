exports.setBoxerStats = function(name) {
	var stats = Alloy.Globals.data[name];
	if (OS_ANDROID) {
		$.name.text = 'Name: ' + name;
	} else {
		$.detail.title = name;
	}
	$.age.text = 'Age: ' + stats.age;
	$.height.text = 'Height: ' + stats.height;
	$.weight.text = 'Weight: ' + stats.weight;
	$.record.text = 'Record: ' + stats.record;	
}