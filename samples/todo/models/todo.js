var moment = require('alloy/moment');

exports.definition = {
	config: {
		"columns": {
			"item":"text",
			"done":"integer",
			"date_completed":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "todo"
		}
	},

	extendModel : function(Model) {
		_.extend(Model.prototype, {
			validate : function(attrs) {
				for (var key in attrs) {
					var value = attrs[key];
					if (value) {
						if (key === "item") {
							if (value.length <= 0) {
								return 'Error: No item!';
							}
						}
						if (key === "done") {
							if (value.length <= 0) {
								return 'Error: No completed flag!';
							}
						}
					}
				}
			}
		});

		return Model;
	},

	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {

			// For Backbone v1.1.2, uncomment this to override the fetch method
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			},
			*/
		});
		return Collection;
	}
};