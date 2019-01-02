var items = [];
for (var i = 0; i < 10; i++) {
	items.push({
		image: {
			image: '/appc.png'
		},
		label: {
			text: 'auto-row #' + (i + 1)
		},
		button: {
			title: i + 1
		}
	});
}
$.section.items = $.section.items.concat(items);

$.index.open();