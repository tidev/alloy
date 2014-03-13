function openWindow(){
	Alloy.createController('LandingPage').getView().open({
		animated: true,
		modal: true
	});
}

$.index.open();