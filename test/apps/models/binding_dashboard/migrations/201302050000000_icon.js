var icons = [
	{
		image: 'account_off.png',
		selectedImage: 'account_on.png',
		badge: 10,
		label: 'account',
		weight: 0
	},
	{
		image: 'calls_off.png',
		selectedImage: 'calls_on.png',
		badge: 110,
		label: 'calls',
		weight: 1
	},
	{
		image: 'cases_off.png',
		selectedImage: 'cases_on.png',
		badge: 0,
		label: 'cases',
		weight: 2
	},
	{
		image: 'contacts_off.png',
		selectedImage: 'contacts_on.png',
		badge: 0,
		label: 'contacts',
		weight: 3
	},
	{
		image: 'emps_off.png',
		selectedImage: 'emps_on.png',
		badge: 0,
		label: 'employees',
		weight: 4
	},
	{
		image: 'leads_off.png',
		selectedImage: 'leads_on.png',
		badge: 1,
		label: 'leads',
		weight: 5
	},
	{
		image: 'meetings_off.png',
		selectedImage: 'meetings_on.png',
		badge: 4,
		label: 'meetings',
		weight: 6
	},
	{
		image: 'opps_off.png',
		selectedImage: 'opps_on.png',
		badge: 0,
		label: 'opps',
		weight: 7
	},
	{
		image: 'tasks_off.png',
		selectedImage: 'tasks_on.png',
		badge: 28,
		label: 'tasks',
		weight: 8
	}
];

migration.up = function(migrator) {
	for (var i = 0; i < icons.length; i++) {
		migrator.insertRow(icons[i]);
	}
};

migration.down = function(migrator) {
	for (var i = 0; i < icons.length; i++) {
		migrator.deleteRow(icons[i]);
	}
};
