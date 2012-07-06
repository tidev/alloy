Multiple View Sample
====================

This is a very basic example of using multiple views and controllers in an application.

As you have probably seen Alloy is very much about convention so it's important to understand the simple connetions used while having multiple views and controllers.

Alloy will during compile will scan the views folder and create Alloy components by combining view elements in markup with JavaScript code contained in the matching by file name controller. When the Alloy app is started the index.xml and index.js provide the bootstrap system. To bring in other views use the CommonJS require method. All Alloy components are CommonJS modules.

For example, if from the index component you wanted to bring in and access another view that you created with an a.xml view and a matching a.js controller you could do the following from index.js.

var a = require('alloy/components/a').create(); 

This now makes the "a" component available within index.js. To make methods available outside of a.js you can use the following 

$.sampFunc = function() {
};

Then from other components or modules you can call the method as you normally would call an exported CommonJS method. 

Looking at the code in this sample you will see that getRoot() is used with the component variable sometimes. GetRoot() returns the Titanium Object associated with top level view element in markup. 


Notes:
- We are still evaluating the use of getRoot() method.
- In index.js the bootstrap file methods are exported just as a regular CommonJS module.




	