exports.definition = {
	
	config: {
		"columns": {
			"title":"string",
			"image":"string",
			"timestamp":"string"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "myModel"
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
			
			// extended functions go here			
			
		}); // end extend
		
		return Collection;
	}
		
}

