var moment = require('alloy/moment');

var USERNAME = 'user',
    PASSWORD = 'password';

exports.definition = {
	config: {
		"columns": {
			"username":"text",
            "email":"text",
			"loggedIn":"integer",
            "loggedInSince":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "user"
		}
	},		

	extendModel : function(Model) {
        _.extend(Model.prototype, {
            login: function(username, password) {
                // Dummy authentication. In a real world scenario, this is 
                // where you'd make a request to your authentication server or
                // other form of authentication. It would also likely return
                // the server time for loggedInSince, rather than using client-side
                // time like we are here.
                if (username === USERNAME && password === PASSWORD) {
                    this.set({
                        loggedIn: 1,
                        loggedInSince: moment.format('YYYY-MM-DD HH:mm:ss.SSS')
                    });
                    this.save();
                    return true;
                } else {
                    return false;
                }
            },
            logout: function() {
                this.set({
                    loggedIn: 0
                });
                this.save();
            }
        });

        return Model;
    }
}

