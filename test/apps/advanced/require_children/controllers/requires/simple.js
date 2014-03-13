var args = arguments[0] || {},
	props = ['backgroundColor', 'left', 'right'];

// assign properties to the simple container
_.each(props, function(p) {
	typeof args[p] !== 'undefined' && ($.simple[p] = args[p]);
});

// add children to simple container, if there are any
_.each(args.children || [], function(child) {
	Ti.API.info('adding child ' + child.toString());

	// I can inject properties if I want
	child.top = '10dp';

	// then add each child where ever I want
	$.simple.add(child);
});