exports.definition = {
	config: {
		'columns': {
			'id': 'String',
			'count': 'Int'
		},
		'defaults': {
			'id': 'instance',
			'count': 0
		},
		'adapter': {
			'type': 'properties',
			'collection_name': 'singleModel'
		}
	},
	extendCollection: function(Collection) {
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
