function onCustomEvent(e) {
	console.log('Congratulations! It works!');
}

var demoModel = Alloy.createModel('Demo');
$.demo.add(demoModel);

$.index.open();
