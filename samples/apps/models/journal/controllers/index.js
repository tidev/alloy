var moment = require('alloy/moment');

function doTransform(model) {
	var transform = model.toJSON();

	transform.dateSince = moment(transform.dateCreated,'YYYYMMDDHHmmss').fromNow();
	switch(transform.mood) {
		case 'mad':
			transform.moodColor = '#a00';
			break;
		case 'happy':
			transform.moodColor = '#0a0';
			break;
		case 'neutral':
		default:
			transform.moodColor = '#88f';
			break;
	}
	return transform;
}

function addEntry() {
	Alloy.createController('add').getView().open();
}

Alloy.Collections.journal.comparator = function(entry1, entry2) {
	return entry1.get('dateCreated') > entry2.get('dateCreated') ? -1 : 1;
};
Alloy.Collections.journal.fetch();

$.index.open();