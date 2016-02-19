var API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
var HANDLERS = ['success','error'];
var MAX_BOOKS = 10; // for demo purposes, set a max for the number of books

var AppModel = require('alloy/backbone').Model.extend({ loading: false });
var model = new AppModel();
var handlers = {};

// react to changes in the model state
model.on('change:loading', function(m) {
	if (m.get('loading')) {
		$.searchView.touchEnabled = false;
		$.search.opacity = 0;
		$.loading.setOpacity(1.0);
	} else {
		$.loading.setOpacity(0);
		$.search.opacity = 1;
		$.searchView.touchEnabled = true;
	}
});

////////////////////////////////////
///////// public functions /////////
////////////////////////////////////
exports.setHandlers = function(args) {
	_.each(HANDLERS, function(h) {
		if (args[h]) {
			handlers[h] = args[h];
		}
	});
};

///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function processBookData(data) {
	var books = [];

	// make sure the returned data is valid
	var items;
	try {
		items = JSON.parse(data).items;
	} catch (e) {
		alert('Invalid response from server. Try again.');
		return;
	}

	// process each book, turning it into a table row
	for (var i = 0; i < Math.min(items.length,MAX_BOOKS); i++) {
		var info = items[i].volumeInfo;
		if (!info) { continue; }
		var links = info.imageLinks || {};
		var authors = (info.authors || []).join(', ');
		books.push({
			title: info.title || '',
			authors: authors,
			image: links.smallThumbnail || links.thumbnail || 'none'
		});
	}

	// fire success handler with list of books
	handlers.success(books);
}

////////////////////////////////////
////////// event handlers //////////
////////////////////////////////////
function searchForBooks(e) {
	$.text.blur();

	// validate search data
	var value = encodeURIComponent($.text.value);
	if (!value) {
		alert('You need to enter search text');
		return;
	}

	// search Google Book API
	model.set('loading', true);
	var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			if (handlers.success) {
				processBookData(this.responseText);
			}
			model.set('loading', false);
		},
		onerror: function(e) {
			if (handlers.error) {
				handlers.error(e);
			} else {
				alert('There was an error processing your search. Make sure you have a network connection and try again.');
				Ti.API.error('[ERROR] ' + (e.error || JSON.stringify(e)));
			}
			model.set('loading', false);
		},
		timeout: 5000
	});
	xhr.open("GET", API_URL + value);
	xhr.send();
}