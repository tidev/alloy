exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			title: 'TEXT',
			subtitle: 'TEXT',
			image: 'TEXT'
		},
		adapter: {
			type: 'sql',
			collection_name: 'info',
			idAttribute: 'id'
		}
	}
}