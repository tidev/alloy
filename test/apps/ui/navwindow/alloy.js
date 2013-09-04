Alloy.Globals = {
	ctr: 0,
	pushWindow: function(e) {
		Alloy.Globals.ctr++;
		Alloy.Globals.navwindow.push(Alloy.createController('win').getView());
	}
};