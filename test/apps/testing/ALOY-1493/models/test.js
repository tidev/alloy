exports.definition = {
	config: {
		'columns': {
			'username': 'text'
		},
		adapter: {
			type: 'sql',
			collection_name: 'test',
			db_file: function() {
				// You can process db file name
				return 'my_custom_db_file';
			}
		}
	}
};
