Multiple View Sample
====================

This is a very basic example of using multiple views and controllers in an application. Click on the label in the window and the sample will display four views. On the last view the click will pop-up an alert from the first view.

As you have probably seen Alloy is very much about convention so it's important to understand the simple connections used when having multiple views and controllers.

Alloy will during compile will scan the views folder and create Alloy controller objects by combining view elements in markup with JavaScript code contained in the matching file name controller. When an Alloy app is started index.xml and index.js are the entry points. To bring in other views use the CommonJS require method. All Alloy components are CommonJS modules.

For example, if from the index controller object you wanted to bring in and access another view that you created with an a.xml view and a matching a.js controller you could do the following from index.js.

var A = require('alloy/controllers/a');  // bring in the class
var a = new A; // create the object

This now makes the "a" available within index.js. To make methods available outside of a.js you can use the following 

$.sampFunc = function() {
};

Make sure to put public methods in the onReady callback.

Then from other components or modules you can call the method as you normally would call an exported CommonJS method. 

Looking at the code in this sample you will see that getRoot() is used with the controller object variables. GetRoot() returns the Titanium Object associated with top level view element in markup. 

When within a component $ represents the JavaScript this keyword.

Notes:
- We are still evaluating the use of getRoot() method.




	