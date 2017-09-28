exports.definition = {
	config: {
		// No need to define columns object, loading the db_file
		// below will do that for us.

		'adapter': {
			'type': 'sql',

			// The table name inside the sqlite database to use for
			// models and collections based on this definition.
			'collection_name': 'fighters',

			// db_file tells model to use myapp.sqlite file to install
			// database
			'db_file': '/myapp.sqlite',

			// db_name tells model to use the given name as the database
			// name instead of using the filename. In this case we'll be
			// using 'fighters' instead of 'myapp'.
			'db_name': 'fighters',

			// idAttribute tells Alloy/Backbone to use this column in
			// my table as its unique identifier field. Without
			// specifying this, Alloy's default behavior is to create
			// and 'alloy_id' field which will uniquely identify your
			// rows in the table.
			'idAttribute': 'id',

			// remoteBackup tells Alloy to set the value of the property
			// Ti.Filesystem.File.remoteBackup. This setting tells iOS
			// whether or not to allow your database to be backed up to
			// iCloud or in iTunes backups.
			'remoteBackup': false
		}
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {

			// For Backbone v1.1.2, uncomment this to override the fetch method
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			},
			*/
		});
		return Collection;
	}
};