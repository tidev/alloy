exports.definition = {
	config: {
		columns: {
			image: 'TEXT',
			selectedImage: 'TEXT',
			badge: 'INTEGER',
			label: 'TEXT',
			weight: 'INTEGER'
		},
		adapter: {
			type: 'sql',
			collection_name: 'icons'
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// Extend, override or implement Backbone.Model
		});

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

			// Implement the comparator method.
			comparator : function(icon) {
				return icon.get('weight');
			}

		}); // end extend

		return Collection;
	}
};