function <%= openFunc %>() {
	<%= parent %>.removeEventListener('open', <%= openFunc %>);
	if (<%= parent %>.activity) {
		<%= parent %>.activity.onCreateOptionsMenu = function(<%= eventObject %>) {
			<%= code %>
		};
	} else {
		Ti.API.warn('You attempted to attach an Android Menu to a lightweight Window');
		Ti.API.warn('or other UI component which does not have an Android activity.');
		Ti.API.warn('Android Menus can only be opened on TabGroups and heavyweight Windows.');
	}
}
<%= parent %>.addEventListener('open', <%= openFunc %>);