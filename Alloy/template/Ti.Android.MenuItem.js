var <%= style %> = <%= styleCode %>;
if(<%= actionView %>) {
	<%= style %>.actionView = <%= actionView %>;
}
<%= item %> = <%= parent %>.add(_.pick(<%= style %>,Alloy.Android.menuItemCreateArgs));
<%= item %>.applyProperties(_.omit(<%= style %>,Alloy.Android.menuItemCreateArgs));
$.<%= argsId %> = <%= item %>;
