function <%= openFunc %>() {
	<%= parent %>.removeEventListener('open', <%= openFunc %>);
	if (<%= parent %>.activity) {
		<%= code %>
	} else {
		Ti.API.warn('You attempted to access an Activity on a lightweight Window or other');
		Ti.API.warn('UI component which does not have an Android activity. Android Activities');
		Ti.API.warn('are valid with only windows in TabGroups or heavyweight Windows.');
	}
}
<%= parent %>.addEventListener('open', <%= openFunc %>);
