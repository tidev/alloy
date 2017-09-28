exports.definition = {

	config: {
		'columns': {
			'name':'text',
			'email':'text',
			'twitter':'text'
		},
		'defaults': {
			'name':'Tony Lukasavage',
			'email':'tlukasavage@appcelerator.com',
			'twitter':'@tonylukasavage'
		},
		'adapter': {
			'type': 'sql',
			'collection_name': 'info'
		}
	},

	extendModel: function(Model) {
		_.extend(Model.prototype, {

			// extended functions go here

		}); // end extend

		return Model;
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

		}); // end extend

		return Collection;
	}

};