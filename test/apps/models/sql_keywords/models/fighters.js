exports.definition = {
	config: {
		"columns": {
			name: 'TEXT',
			nickname: 'TEXT',

			// column values can have types with keywords
			fighterId: 'INTEGER PRIMARY KEY AUTOINCREMENT'
		},

		"adapter": {
			"type": "sql",

			// The table name inside the sqlite database to use for
			// models and collections based on this definition.
			"collection_name": "fighters",

			// idAttribute tells Alloy/Backbone to use this column in
			// my table as its unique identifier field. Without
			// specifying this, Alloy's default behavior is to create
			// and "alloy_id" field which will uniquely identify your
			// rows in the table with a text GUID.
			"idAttribute": "fighterId"
		}
	}
}