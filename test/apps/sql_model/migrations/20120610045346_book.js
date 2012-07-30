

migration.up = function(db)
{
	// db is a special database handle that would be passed to the 
	// migration and will provide some convenience functions on top of the 
	// normal Titanium Database APIs to make it easier to create a table from JSON
	
	db.createTable("books",
	{
		"columns":
		{
			"book": "string",
			"author": "string"
		},

		"defaults":
		{
			"book": "-",
			"author": "-"
		},
		"adapter": {
			"type": "sql",
			"tablename": "books"
		}
	});
	
};

migration.down = function(db)
{
	db.dropTable("books");
};
