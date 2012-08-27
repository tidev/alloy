var configuration = {
		"columns": <%= columns %>,
    	"defaults": {},
    	
    	"stores": {
    		"_defaults":"sql",
        	"sql":{
	        	"name": "<%= name %>"
        	},
        	//"properties":{
	    		//    "name": "tablename"
        	//}
    	},
};
var model = function(Model) {
	// add code to modify/extend your Model definition

	// Example:
	//   return Model.extend({
	//       customProperty: 123,
	//       customFunction: function() {}
	//   });

	return Model;
};

var collection = function(Collection) {
	// add code to modify/extend your Model definition

	// Example:
	//   return Collection.extend({
	//       customProperty: 123,
	//       customFunction: function() {}
	//   });

	return Collection;
};