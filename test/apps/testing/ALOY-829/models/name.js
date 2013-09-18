exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			name: 'TEXT'
		},
		adapter: {
			type: 'sql',
			db_name: 'name',
			collection_name: 'name',
			idAttribute: 'id'
		}
	}
};