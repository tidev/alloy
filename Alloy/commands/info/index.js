/*
	The `alloy info` command is used by Studio to discover info about supported adapters,
	sample applications, and application templates.
*/
var path = require('path'),
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	alloyRoot = path.join(__dirname, '..', '..', '..');

var info = {
	// TODO: reorganize and dynamically list data for adapters
	adapters: function() {
		var desc = {
			properties: {
				Description: 'Local persistence adapter that uses Ti.App.Properties storage',
				platforms: ['android', 'ios', 'mobileweb', 'blackberry', 'windows']
			},
			sql: {
				Description: 'Local persistence adapter that uses SQLite storage',
				platforms: ['android', 'ios', 'blackberry', 'windows']
			}
		};
		console.log(JSON.stringify(desc, null, 4));
	},
	samples: function() {
		var desc = [
			{
				name: 'todo',
				label: 'Todo List',
				Description: 'A sample application that creates a basic todo list. With this app you can maintain a listing of tasks to be completed, add to that list, and mark tasks as done, all powered by Alloy models and collections.',
				icon: 'app.png'
			}
		];
		console.log(JSON.stringify(desc, null, 4));
	},
	templates: function() {
		var desc = [
			{
				name: 'default',
				label: 'Default Alloy Project',
				Description: 'Basic "Hello, World!" application using the Alloy MVC framework.',
				icon: 'app.png'
			},
			{
				name: 'two_tabbed',
				label: 'Two-tabbed Alloy Application',
				Description: "Titanium's traditional two-tabbed application created using the Alloy MVC framework.",
				icon: 'app.png'
			},
			{
				name: 'webpack-default',
				label: 'Alloy Project with webpack',
				Description: 'A two-tabbed application created using the Alloy MVC framework and setup for weback support',
				icon: 'app.png'
			}
		];
		console.log(JSON.stringify(desc, null, 4));
	},
	namespaces: function() {
		console.log(JSON.stringify(CONST.IMPLICIT_NAMESPACES, null, 4));
	}
};

module.exports = function(args, program) {
	var target = args[0];

	if (!info[target]) {
		U.die('Invalid target for `alloy info`: ' + target);
	} else {
		info[target]();
	}
};
