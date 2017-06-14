function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ?
		'<%= WIDGETID %>/' + s :
		s.substring(0, index) + '/<%= WIDGETID %>/' + s.substring(index + 1);

	return path.indexOf('/') !== 0 ? '/' + path : path;
}