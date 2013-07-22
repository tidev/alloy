var <%= style %> = <%= styleCode %>;
<%= item %> = <%= parent %>.add(_.pick(<%= style %>,Alloy.Android.menuItemCreateArgs));
<%= item %>.applyProperties(_.omit(<%= style %>,Alloy.Android.menuItemCreateArgs));