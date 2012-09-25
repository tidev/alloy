/**
 * @class Alloy.widgets.searchForBooks
 * The searchForBooks widget sends a query to the Google Books API to retrieve book data.
 * In the view, it appears as a search bar with a textbox and a button icon.
 *
 * ### Usage
 *
 * To use the widget, first add it as a dependency in the `config.json` file:
 *
 *     "dependencies": {
 *         "com.appcelerator.searchForBooks":"1.0"
 *     }
 *
 * Next, add it to a view in the project, using the Require tag:
 *
 *     <Require id="sfb" type="widget" src="com.appcelerator.searchForBooks"/>
 *
 * Note: the `id` attribute is a unique identfier and can be anything. `sfb` is just an example.
 *
 * In the controller, use the `setHandlers` method to register a callback to process the retrieved data.
 *
 *     function processData(books){
 *        var data = [];
 *        books.forEach(function(book){
 * 	          var label = book.title + ' by ' + book.authors;
 *            var row = Ti.UI.createTableViewRow({title:label});
 *            data.push(row)
 *        });
 *        // tableView is a Ti.UI.TableView object in the view
 *        $.tableView.setData(data);
 *     }
 *     $.sfb.setHandlers({
 * 	       success: processData
 *     });
 *
 * ### Accessing View Elements
 *
 * The following is a list of GUI elements in the widget's view.  These IDs can be used to
 * override or access the properties of these elements:
 *
 * - `bar`: Titanium.UI.View for the entire widget.
 * - `text`: Titanium.UI.TextField for the search box.
 * - `searchView`: Titanium.UI.View for the icons and acts as a button.
 * - `search`: Titanium.UI.ImageView for the search icon.
 * - `loading`: Alloy.widgets.loading for the loading icon.
 *
 * Prefix the special variable `$` and the widget ID to the element ID, to access
 * that view element, for example, `$.sfb.text` will give you access to the TextField.
 */


var API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
var HANDLERS = ['success','error'];
var MAX_BOOKS = 10; // for demo purposes, set a max for the number of books

var AppModel = require('alloy/backbone').Model.extend({ loading: false });
var model = new AppModel;
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
/**
 * @method setHandlers
 * Binds callback handlers to events
 * @param {Object} args Callbacks to register.
 * @param {function(Array.<Object>)} args.success Callback fired after successfully retrieving book data.
 * Passed context is an array of book data {`title`:String, `authors`:String, `image`:String}.
 * @param {function(Object)} [args.error] Callback to override the default error handling.
 * Passed context is an error object, which is the same as the one from Titanium.Network.HTTPClient.onerror.
 */

exports.setHandlers = function(args) {
	_.each(HANDLERS, function(h) {
		if (args[h]) {
			handlers[h] = args[h];
		}
	});
}	

///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function processBookData(data) {
	var books = [];

	// make sure the returned data is valid
	try {
		var items = JSON.parse(data).items;
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