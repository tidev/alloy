var args = arguments[0] || {},
	children = args.children || [];

function addViewIfExists(id, parent) {
	var view;

	// find the UI component by id
	if (view = _.find(children, function(c) { return c.id === id; })) {

		// add a class to style it
		$.addClass(view, id);

		// add the component to the given parent container
		parent.add(view);
	}
}

// add children to widget, using specific rules and order for each
addViewIfExists('image', $.titlebar);
addViewIfExists('title', $.titlebar);
addViewIfExists('action', $.content);
