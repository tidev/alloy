exports.definition = {
	config: {
		'columns': {
			'id': 'INTEGER PRIMARY KEY AUTOINCREMENT',
			'title': 'TEXT'
		},
		'adapter': {
			'type': 'sql',
			'collection_name': 'mymodel',
			'idAttribute': 'id'
		}
	}
};
