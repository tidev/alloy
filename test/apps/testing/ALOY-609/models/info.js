exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			title: 'TEXT',
			subtitle: 'TEXT',
			image: 'TEXT'
		},
		adapter: {
			type: 'sql',
			collection_name: 'info',
			idAttribute: 'id'
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
}