function mapClick(e) {
	Ti.API.info('map clicked');
}

function windowClick(e) {
	Ti.API.info('window clicked');
}

function modelChange(e) {
	Ti.API.info('model change');
}

function anotherModelChange(e) {
	Ti.API.info('another model change');
}

function collectionChange(e) {
	Ti.API.info('collection change');
}

function emptyInit(e) {
	Ti.API.info('empty controller init');
}

$.index.open();

$.map2.fireEvent('click');
Alloy.Collections.empty.trigger('change');
Alloy.Models.empty.trigger('change');
$.anotherModel.trigger('change');