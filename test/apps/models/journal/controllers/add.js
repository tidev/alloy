var moment = require('alloy/moment');
var journal = Alloy.Collections.journal;

function focusText() {
    $.text.focus();
}

function closeKeyboard(e) {
    e.source.blur();
}

function getMood(moodComponent) {
    if (OS_IOS) {
        switch(moodComponent.index) {
            case 0:
                return 'happy';
            case 2:
                return 'mad';
            case 1:
            default:
                return 'neutral';
        }
    } else {
        return moodComponent.getSelectedRow(0).title;
    }
}

function addEntry() {
    // create a new model instance based on user input
    var entry = Alloy.createModel('journal', {
        title : $.title.value,
        text: $.text.value,
        mood: getMood($.mood),
        dateCreated: moment().format('YYYYMMDDHHmmss')
    });

    // add new model to the global collection reference
    journal.add(entry);

    // save the model to sql storage and refresh
    entry.save();
    journal.fetch();

    closeWindow();
}

function closeWindow() {
    $.addWin.close();
}
