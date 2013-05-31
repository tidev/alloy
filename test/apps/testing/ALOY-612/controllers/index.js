$.index.open();

var style = require('alloy/styles/index');
var i, len;	
for (i = 0, len = $.index.children.length; i < len; i++) {
	var child = $.index.children[i];
	child.addEventListener('click', function(e) {
		var id = e.source.id;
		_.each(style, function(o) {
			if (o.key === id && o.isId) {
				// print each style that applies by ID to the source
				Ti.API.info(JSON.stringify(o));
			}
		});
	});
}