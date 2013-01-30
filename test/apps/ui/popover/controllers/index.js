function openPopover() {
	if (Ti.Platform.osname === 'ipad') {
		var popover = Alloy.createController('popover').getView();
		popover.show({view:$.button});	
	} else {
		alert('Popover only supported on iPad');
	}
}

$.index.open();