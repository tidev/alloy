var path = require('path'),
	logger = require('../../common/logger'),
	_ = require('../../lib/alloy/underscore')._,
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	alloyRoot = path.join(__dirname,'..','..','..'); 

var info = {
	// TODO: reorganize and dynamically list data for adapters
	adapters: function() {
		var desc = {
			properties: {
				description: 'Local persistence adapter that uses Ti.App.Properties storage',
				platforms: ['android','ios','mobileweb']
			},
			sql: {
				description: 'Local persistence adapter that uses SQLite storage',
				platforms: ['android','ios']
			},
			localStorage: {
				description: 'Local persistence adapter that uses HTML5 localStorage API',
				platforms: ['mobileweb']
			}
		};
		console.log(JSON.stringify(desc));
	},
	samples: function() {
		var desc = [
			{
				name: "mapping", 
				label: "Geocoder (Alloy)", 
				Description: "A sample app that uses native maps to plot locations. With it you can forward geocode addresses and add them as annotations to the map.", 
				icon: "app.png"
			},
  			{
  				name: "rss", 
  				label: "RSS Reader (Alloy)", 
  				Description: "A sample Master/Detail app that creates a RSS reader. With it you can pull live RSS feeds from the internet, list them along with thumbnails, then drill down to the article itself.", 
  				icon: "app.png"
  			},
  			{
  				name: "todo", 
  				label: "Todo List (Alloy)", 
  				Description: "A sample application that creates a basic todo list. With this app you can maintain a listing of tasks to be completed, add to that list, and mark tasks as done, all powered by Alloy models and collections.", 
  				icon: "app.png"
  			}
		];
		console.log(JSON.stringify(desc));
		//console.log(U.prettyPrintJson(desc));
	},
	templates: function() {
		var desc = [
			{
				name: "default", 
				label: "Default Alloy Project", 
				Description: "Basic \"Hello, World!\" application using the Alloy MVC framework.", 
				icon: "app.png"
			},
  			{
  				name: "two_tabbed", 
  				label: "Two-tabbed Alloy Application", 
  				Description: "Titanium's traditional two-tabbed application created using the Alloy MVC framework.", 
  				icon: "app.png"
  			}
		];
		console.log(JSON.stringify(desc));
	},
	namespaces: function() {
		console.log(JSON.stringify(CONST.IMPLICIT_NAMESPACES));
	}
};

module.exports = function(args, program) {
	var target = args[0]; 

	if (!info[target]) {
		U.die('Invalid target for `alloy info`: ' + target);
	} else {
		info[target]();
	}
}
