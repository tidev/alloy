exports.definition = {
	config: {
		"columns": {
			name: 'TEXT',

			// column values can have types with keywords
			thingId: 'INTEGER PRIMARY KEY AUTOINCREMENT'
		},

		"adapter": {
			"type": "sql",

			// The table name inside the sqlite database to use for
			// models and collections based on this definition.
			"collection_name": "things",

			// idAttribute tells Alloy/Backbone to use this column in
			// my table as its unique identifier field. Without
			// specifying this, Alloy's default behavior is to create
			// and "alloy_id" field which will uniquely identify your
			// rows in the table with a text GUID.
			"idAttribute": "thingId"
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