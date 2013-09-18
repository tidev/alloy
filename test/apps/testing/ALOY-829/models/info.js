exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			info: 'TEXT'
		},
		adapter: {
			type: 'sql',
			db_name: 'info',
			collection_name: 'info',
			idAttribute: 'id'
		}
	}
};