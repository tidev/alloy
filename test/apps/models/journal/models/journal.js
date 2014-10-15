exports.definition = {
	config: {
		"columns": {
			"title":"TEXT",
			"text":"TEXT",
			"mood":"TEXT",
			"dateCreated":"TEXT"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "journal"
		}
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

