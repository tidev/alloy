exports.definition = {
	
	config: {
		"adapter": {
			"type": "localStorage",
			"collection_name": "books"
		}
	},		

	extendModel: function(Model) {		
		_.extend(Model.prototype, {
						
			validate: function (attrs) {
				for (var key in attrs) {
					var value = attrs[key];
					if (key === "book") {
						if (value.length <= 0) {
							return 'Error: No book!';
						}
					}
					if (key === "author") {
						if (value.length <= 0) {
							return 'Error: No author!';
						}	
					}	
				}
			}	

		}); // end extend
		
		return Model;
	},
	
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
						
			
		}); // end extend
		
		return Collection;
	}
		
}
