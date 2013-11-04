var args = arguments[0] || {};

if (args.isSection) {
	$.addClass($.headerView, 'section');
	$.addClass($.footerView, 'section');
}
