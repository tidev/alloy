var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randomString(length) {
	length = length || 8;
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
if (!Ti.App.Properties.hasProperty('lvsearch')) {
	for(var i=1,j=30;i<j;i++) {
		Alloy.createModel('rows', { title: randomString()}).save();
	}
	Ti.App.Properties.setString('lvsearch', 'yes');
}
Alloy.Collections.rows.fetch();

if(OS_IOS) {
	$.searchList.addEventListener('cancel', function(e){
		// hide the keyboard on Cancel
		$.searchList.blur();
	});
}

$.index.open();
