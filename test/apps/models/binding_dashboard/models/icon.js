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

			// Implement the comparator method.
			comparator : function(icon) {
				return icon.get('weight');
			}

		}); // end extend

	return Collection;
	}
};