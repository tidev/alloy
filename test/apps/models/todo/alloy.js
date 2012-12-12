Alloy.Globals = Alloy.CFG;
Alloy.Globals.todos = Alloy.createCollection('Todo');
Alloy.Globals.todos.comparator = function(todo) {
	return todo.get('done');
}

Ti.API.info(' TODOS ' + JSON.stringify(Alloy.Globals.todos.toJSON(),null,2));