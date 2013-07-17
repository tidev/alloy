var Alloy = require('alloy');

// Hold a collection of widget objects instances. These
// objects are not the widgets themselves, but a set of
// auto-populated functions and properties that make
// developing widgets easier.
var widgets = {};

function ucfirst(text) {
    if (!text) { return text; }
    return text[0].toUpperCase() + text.substr(1);
}

module.exports = function(widgetId) {
	var self = this;

	// return existing widget object, if present
	if (widgets[widgetId]) {
		return widgets[widgetId];
	}

	// properties
	this.widgetId = widgetId;
	this.Collections = {};
	this.Models = {};
	this.Shared = {};

	// functions
	this.createController = function(name, args) {
		return new (require('alloy/widgets/' + widgetId + '/controllers/' + name))(args);
	};
	this.createCollection = function(name, args) {
		return new (require('alloy/widgets/' + widgetId + '/models/' + ucfirst(name)).Collection)(args);
	};
	this.createModel = function(name, args) {
		return new (require('alloy/widgets/' + widgetId + '/models/' + ucfirst(name)).Model)(args);
	};
	this.createWidget = Alloy.createWidget; // just to be complete
	this.Collections.instance = function(name) {
		return self.Collections[name] || (self.Collections[name] = self.createCollection(name));
	};
	this.Models.instance = function(name) {
		return self.Models[name] || (self.Models[name] = self.createModel(name));
	};

	// add to widget object instances
	widgets[widgetId] = this;
};