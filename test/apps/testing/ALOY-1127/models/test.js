exports.definition = {
	config: {
		'columns' : {
			'username' : 'text'
		},
		adapter: {
			type: 'sql',
			collection_name: 'test'
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
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