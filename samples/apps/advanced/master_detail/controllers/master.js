function openDetail(e) {
	$.trigger('detail', e);
}

var data = [];
_.each(Alloy.Globals.data, function(stats, name) {
	data.push(Alloy.createController('row', {
		name: name,
		nickname: stats.nickname
	}).getView());
});
$.table.setData(data);

// runtime unit tests
if (!ENV_PROD) {
	require('specs/master')($);
}