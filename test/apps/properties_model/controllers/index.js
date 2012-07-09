var dispatcher = _.clone(require('alloy/backbone').Events);
var CRUDops = {
	"create": function(o) { Ti.API.info("CREATE called with model="+JSON.stringify(o)); },
    "read": function(o) { Ti.API.info("READ called with model="+JSON.stringify(o)); },
    "update": function(o) { Ti.API.info("UPDATE called with model="+JSON.stringify(o)); },
    "delete": function(o) { Ti.API.info("DELETE called with model="+JSON.stringify(o)); }
};
$.AppCollection.notify.on('sync', function(e) {
	CRUDops[e.method](e.model);	
});

var app = new $.App({count:0});
$.button.on('click', function(e) {
	app.set({count:4});
	app.save();
	dispatcher.trigger('count:changed', app.get('count'));
	//Ti.API.info(app.get('count'));
	//app.set({count:4})
	//app.save({count:2});
	// update model

});

$.label.on('app:increment', function(e) {
	// get valu from model and update label
});

dispatcher.on('count:changed', function(count) {
	$.label.text = 'count: ' + count
});

$.win.open();