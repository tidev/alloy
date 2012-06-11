

migration.up = function(db)
{
	// db is a special database handle that would be passed to the 
	// migration and will provide some convenience functions on top of the 
	// normal Titanium Database APIs to make it easier to create a table from JSON
	
	db.createTable("todos",
	{
		"columns":
		{
			"name": "string",
			"done": "boolean"
		},

		"defaults":
		{
			"name":"",
			"done":false
		},
		
		"tablename":"todos"
	});
	
};

migration.down = function(db)
{
	db.dropTable("todos");
};
