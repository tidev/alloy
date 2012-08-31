Multiple View Sample
====================

This is a very basic example of using multiple views and controllers in an application. Click on the label in the window and the sample will display four views. On the last view the click will pop-up an alert from the first view.

As you have probably seen Alloy is very much about convention so it's important to understand the simple connections used when having multiple views and controllers.

Alloy will during compile will scan the views folder and create Alloy controller objects by combining view elements in markup with JavaScript code contained in the matching file name controller. When an Alloy app is started index.xml and index.js are the entry points. To bring in other views use the CommonJS require method. All Alloy components are CommonJS modules.

For example, if from the index controller object you wanted to bring in and access another view that you created with an a.xml view and a matching a.js controller you could do the following from index.js.

var a = Alloy.createController('alloy/controllers/a');  // bring in the class

You pass in arguments to the newly created controller using the same syntax:

var a = Alloy.createController('alloy/controllers/a', args);  // pass in args

In the controller you access the args using the Javascript argument object, for example:

var args = arguments[0] || {};

for (var k in args) {
	$.loading[k] = args[k];	
}

This now makes the "a" available within index.js. To make methods available outside of a.js you can use the following 

exports.sampFunc = function() {
};


Then from other components or modules you can call the method as you normally would call an exported CommonJS method. 

Looking at the code in this sample you will see that getView() is used with the controller object variables. GetView() returns the Titanium Object associated with top level view element in markup. To get at any view element/object use getView('id').

Within a controller $ represents the Javascript this keyword.






	