function openPopover() {
	var popover = Alloy.createController('popover').getView();
	popover.show({view:$.button1});
}
function openPopoverWin() {
	var popover = Alloy.createController('popover_win').getView();
	popover.show({view:$.button2});
}
function openPopoverNavWin() {
	var popover = Alloy.createController('popover_navwin').getView();
	popover.show({view:$.button3});
}

$.index.open();