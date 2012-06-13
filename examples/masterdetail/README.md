Master/Detail
=============

In this example, we're going to show how we can create a loosely-coupled UI with a typical master/detail app. 

The `master` view and `detail` view will have absolutely no dependencies on each other. `master` will never directly reference `detail`, and vice versa. All communication between the views will take place in the `index.js` controller, which will act as a delegate between the views.

We will use custom events from the `master` to communicate back to the `index` controller, which will then perform the appropriate operations on the `detail`. In the `master` controller, a custom event will be fired like this when its TableView is clicked:

```javascript
$.table.addEventListener('click', function(e) {
	exports.fireEvent('rowClick', {image:e.row.image});
});
```

The `index` controller will subscribe to this event with the following code, which in turn updates and/or renders the `detail` view:

```javascript
$.master.addEventListener('rowClick', function(e) {
	$.detail.updateContent(e);
	$.detail.open();
});
``` 

This is an exercise in MVC separation and the use of delegates and custom events. Loose-coupling of components in this manner is a best practice that will allow you to build scalable and maintainable apps. It also allows you to leverage platform-specific navigation without having to write platform-specific code for your `master` and `detail`, which will be detailed in a future update.

TODO
====

* Use markup conditionals (not yet implemented) to allow us to represent the master/detail app in a platform-specific manner, without having to change the master view or detail view's code. We should represent the app as follows:
	* **iPad** - [Ti.UI.iPad.SplitWindow](http://docs.appcelerator.com/titanium/2.0/index.html#!/api/Titanium.UI.iPad.SplitWindow)
	* **iPhone** - [Ti.UI.iPhone.NavigationGroup](http://docs.appcelerator.com/titanium/2.0/index.html#!/api/Titanium.UI.iPhone.NavigationGroup)
	* **Mobile Web** - [Ti.UI.MobileWeb.NavigationGroup](http://docs.appcelerator.com/titanium/2.0/index.html#!/api/Titanium.UI.MobileWeb.NavigationGroup)
	* **Android** - As a window stack, using the `back` button to go back to the `master` view 
