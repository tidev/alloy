Alloy.globals = Alloy.CFG;
Alloy.globals.todos = Alloy.createCollection('Todo');
Alloy.globals.todos.comparator = function(todo) {
	return todo.get('done');
}

Ti.API.info(' TODOS ' + JSON.stringify(Alloy.globals.todos.toJSON(),null,2));