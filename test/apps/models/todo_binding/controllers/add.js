function addItem() {
    // Create a new model for the todo collection
    var task = Alloy.createModel('Todo', {
        item : $.itemField.value,
        done : 0
    });
    
    // add new model to the global collection
    Alloy.Collections.todo.add(task);

    // save the model to persistent storage
    task.save();

    closeWindow();
}

function focusTextField() {
    $.itemField.focus();
}

function closeKeyboard(e) {
    e.source.blur();
}

function closeWindow() {
    $.addWin.close();
};
