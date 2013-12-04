var todos = Alloy.Collections.todo;
var INDEXES = {
	'All': 0,
	'Active': 1,
	'Done': 2
};
var whereIndex = INDEXES['All'];

// open the window
$.todoWin.open();

// fetch existing todo items from storage
todos && todos.fetch();

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.
function whereFunction(collection) {
	return !whereIndex ?
		collection.models :
		collection.where({ done: whereIndex === 1 ? 0 : 1 });
}

// Perform transformations on each model as it is processed. Since
// these are only transformations for UI representation, we don't
// actually want to change the model. Instead, return an object
// that contains the fields you want to use in your bindings. The
// easiest way to do that is to clone the model and return its
// attributes with the toJSON() function.
function transformFunction(model) {
	var transform = model.toJSON();
	transform.item = '[' + transform.item + ']';
	return transform;
}

// open the "add item" window
function addToDoItem() {
	Alloy.createController("add").getView().open();
}

// Show task list based on selected status type
function showTasks(e) {
	if (typeof e.index !== 'undefined' && e.index !== null) {
		whereIndex = e.index; // TabbedBar
	} else {
		whereIndex = INDEXES[e.source.title]; // Android menu
	}
	todos.fetch();
}