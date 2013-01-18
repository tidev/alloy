var moment = require('moment');

exports.definition = {
	config: {
		"columns": {
			"item":"text",
			"done":"integer",
			"date_completed":"date"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "todo"
		}
	},		

	extendModel : function(Model) {
        _.extend(Model.prototype, {
            validate : function(attrs) {
                for (var key in attrs) {
                    var value = attrs[key];
                    if (value) {
                        if (key === "item") {
                            if (value.length <= 0) {
                                return 'Error: No item!';
                            }
                        }
                        if (key === "done") {
                            if (value.length <= 0) {
                                return 'Error: No completed flag!';
                            }
                        }
                    }
                }
            }
        });

        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {
        		comparator: function(todo) {
				return todo.get('done');
			},

            /**
             * returns all objects that were completed today
             */
            completedToday : function(_options) { debugger;
                var self = this;

                // this can be more elegant, but kept it simple for demo purposes
                //
                // db.execute("SELECT FROM " + table + " " + opts.query.sql, opts.query.params);
                //
                var yesterday, tomorrow, today;

                // get today and reset to midnight
                yesterday = moment().hours(0).minutes(0).seconds(1).subtract('days', 1);
                tomorrow = moment().hours(0).minutes(0).seconds(1).add('days', 1);

                // debug information
                Ti.API.info("today " + moment().hours(0).minutes(0).seconds(1).calendar());
                Ti.API.info("yesterday " + yesterday.calendar());
                Ti.API.info("tomorrow " + tomorrow.calendar());

                var p = [];
                p.push(yesterday.unix() +"");
                p.push(tomorrow.unix() +"");
                // pass params
                _options['query'] = {
                    "sql" : 'WHERE date_completed between ? AND ?',
                    "params" : p
                };
                self.fetch(_options);
            },
        });
        // end extend

        return Collection;
    }
}

