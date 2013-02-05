exports.definition = {
	config: {
		columns: {
			image: 'TEXT',
			selectedImage: 'TEXT',
			badge: 'INTEGER',
			label: 'TEXT'
		},
		adapter: {
			type: 'sql',
			collection_name: 'icons'
		}
	}
}