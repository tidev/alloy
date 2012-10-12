var path = require('path'),
	logger = require('../../common/logger'),
	_ = require('../../lib/alloy/underscore')._,
	U = require('../../utils'),
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
		console.log(U.prettyPrintJson(desc));
	}
};

module.exports = function(args, program) {
	var target = args[0] || 'ALL';

	if (target === 'ALL') {
		_.each(_.keys(info), function(a) {
			info[a]();
		});
	} else if (!info[target]) {
		U.die('Invalid target for `alloy info`: ' + target);
	} else {
		info[target]();
	}
}
