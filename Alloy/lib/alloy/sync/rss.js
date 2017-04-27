'use strict';

/**
 * Called to sync
 * @param  {string} method Sync method (only `read` is supported)
 * @param  {Object} model  Model/Collection to sync
 * @param  {Object} opts   Options passed to the `.fetch()` call
 */
module.exports.sync = function Sync(method, model, opts) {
	var url;

	if (method === 'read') {
		url = opts.url || model.config.adapter.url;

		/**
		 * Handles the received XML and parses it to models
		 * @param  {string} err   Error
		 * @param  {Object} xml   Ti.XML.Document
		 */
		loadUrl(url, function onLoad(err, xml) {

			if (err) {
				return opts.error && opts.error(err);
			}

			try {

				// parse the Ti.XML.Document to an array of objects
				var data = parseXML(xml);

				opts.success && opts.success(data.length === 1 ? data[0] : data);

				model.trigger('fetch');

				// catch any exceptions thrown
			} catch (e) {
				return opts.error && opts.error(e);
			}

		});

	} else {
		throw 'Unsupported operation.';
	}
};

/**
 * Executes after a model has been created
 * @param  {Object} Model Model object
 * @param  {string} name  Name of the model
 * @return {Object}       Modified model object
 */
module.exports.afterModelCreate = function afterModelCreate(Model, name) {
	Model = Model || {};
	Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;
	return Model;
};

/**
 * Parses an Ti.XML.Document to an array of objects
 * @param  {Object} xml Ti.XML.Document
 * @return {[Object]}   Array of objects
 */
function parseXML(xml) {
	var models = [];

	var elements = xml.documentElement.getElementsByTagName('item');

	// for each <item>
	for (var i = 0; i < elements.length; i++) {
		var element = elements.item(i);
		var model = {};

		var childNodes = element.childNodes;
		var child;

		// for all childNodes
		for (var j = 0; j < childNodes.length; j++) {
			child = childNodes.item(j);

			// if the child is an element containing a text or CDATA node
			if (child.nodeType === child.ELEMENT_NODE && child.childNodes.length === 1 && [child.TEXT_NODE, child.CDATA_SECTION_NODE].indexOf(child.childNodes.item(0).nodeType) !== -1) {

				// set or append if model already has a property with the same name
				model[child.nodeName] = model[child.nodeName] ? (_.isArray(model[child.nodeName]) ? model[child.nodeName] : [model[child.nodeName]]).concat(child.textContent) : child.textContent;
			}
		}

		models.push(model);
	}

	return models;
}

/**
 * Loads an RSS string or URL
 * @param  {string}   url      URL or local path to load
 * @param  {Function} callback Callback (error, data) to call when the URL has been loaded and parsed
 */
function loadUrl(url, callback) {
	var xml;

	// assume it to be a local path
	if (url.indexOf('htt') !== 0) {

		// asyncify this sync code block for consistent behavior
		return setTimeout(function () {

			var file = Ti.Filesystem.getFile(url);

			if (!file.exists() || !file.isFile()) {
				return callback('URL is not a file.');
			}

			var text = file.read().text;

			try {

				// parse the string to a Ti.XML.Document
				xml = Ti.XML.parseString(text);

				return callback(null, xml);

				// catch any exceptions thrown
			} catch (e) {
				return callback(e);
			}

		}, 0);
	}

	// fetch the URL
	var xhr = Ti.Network.createHTTPClient({

		/**
		 * Handle response
		 * @param  {Object} e Event
		 */
		onload: function onload(e) {
			var xml = this.responseXML;

			// response was no XML
			if (xml === null || xml.documentElement === null) {
				return callback(String.format('Response did not contain XML: %s', url));
			}

			callback(null, xml);
		},

		/**
		 * Handle error
		 * @param  {Object} e Error
		 */
		onerror: function onerror(e) {
			callback(String.format('Request failed: ' + e.error));
		}
	});

	xhr.open('GET', url);
	xhr.send();
}
