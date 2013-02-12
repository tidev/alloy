var rss = require('rss');

// open detail window
function openDetail(e) {
	$.trigger('detail', e);
}

// Refresh table data from remote RSS feed
function refreshRss() {
	rss.loadRssFeed({
		success: function(data) {
			var rows = [];
			_.each(data, function(item) {
				rows.push(Alloy.createController('row', {
					articleUrl: item.link,
					image: item.image,
					title: item.title,
					date: item.pubDate
				}).getView());
			});
			$.table.setData(rows);
		}
	});
}

// do initial load of RSS
refreshRss();