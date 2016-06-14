var args = arguments[0] || {};

// add children to deep container, if there are any
_.each(args.children || [], function(child) {
	Ti.API.info('adding child ' + child.toString());
	$.inner.add(child);
});