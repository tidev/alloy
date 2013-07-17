function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ?
		'<%= WIDGETID %>/' + s :
		s.substring(0,index) + '/<%= WIDGETID %>/' + s.substring(index+1);

	// TODO: http://jira.appcelerator.org/browse/ALOY-296
	return OS_ANDROID && path.indexOf('/') !== 0 ? '/' + path : path;
}