$.addBtn.addEventListener('click', function() {
    // add todo item
    var todos = Alloy.globals.todos;
    var todo = Alloy.createModel('Todo', {
        item : $.itemField.value,
        done : 0
    });
    
    // add new model to local collection
    todos.add(todo);

		// save the model to sql storage
    todo.save();

    $.addWin.close();

		// reload the collection from sql storage
    todos.fetch({
        add : false
    });
});

$.cancelBtn.addEventListener('click', function() {
    $.addWin.close();
});
