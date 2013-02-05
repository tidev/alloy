var icons = [
	{
		image: 'account_off.png',
		selectedImage: 'account_on.png',
		badge: 10,
		label: 'account'
	},
	{
		image: 'calls_off.png',
		selectedImage: 'calls_on.png',
		badge: 110,
		label: 'calls'
	},
	{
		image: 'cases_off.png',
		selectedImage: 'cases_on.png',
		badge: 0,
		label: 'cases'
	},
	{
		image: 'contacts_off.png',
		selectedImage: 'contacts_on.png',
		badge: 0,
		label: 'contacts'
	},
	{
		image: 'emps_off.png',
		selectedImage: 'emps_on.png',
		badge: 0,
		label: 'employees'
	},
	{
		image: 'leads_off.png',
		selectedImage: 'leads_on.png',
		badge: 1,
		label: 'leads'
	},
	{
		image: 'meetings_off.png',
		selectedImage: 'meetings_on.png',
		badge: 4,
		label: 'meetings'
	},
	{
		image: 'opps_off.png',
		selectedImage: 'opps_on.png',
		badge: 0,
		label: 'opps'
	},
	{
		image: 'tasks_off.png',
		selectedImage: 'tasks_on.png',
		badge: 28,
		label: 'tasks'
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
