function openPopover() {
	var popover = Alloy.createController('popover').getView();
	popover.show({view:$.button});	
}

$.index.open();