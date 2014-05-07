Ti.API.info('seeded: ' + Ti.App.Properties.hasProperty('seeded'));
if (!Ti.App.Properties.hasProperty('seeded')) {
	for(var i=1,j=7;i<j;i++) {
		Alloy.createModel('rows', { title: 'Row '+i}).save();
	}
	Ti.App.Properties.setString('seeded', 'yes');
}
 
Alloy.Collections.rows.fetch();
 
$.addRow.addEventListener('click', function(){
	Alloy.createModel('rows', { title: 'Row ' + (Alloy.Collections.rows.size()+1)}).save();
	Alloy.Collections.rows.fetch();
});


$.index.open();
