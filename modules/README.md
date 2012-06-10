Modules
=======

In this example, we're going to show how we add both local modules developed by the app as well as imported vendor modules.

App modules should be placed in a folder named `lib`.  You can either specify a module name ending with `.js` or a directory with the module name and the module name ending with `.js` as a file in the folder.  

For vendor modules, specify them in a folder named `vendor` using the same syntax as `lib`.

To use app modules, you must use the CommonJS `require` method.  To specify vendor modules, make sure you specify the `vendor` prefix.

	var foo = require("foo"); // app module
	var bar = require("vendor/bar"); // vendor module
	
Functionally, there is no difference between an app specific module or a vendor specific module.  Both must be specified as a CommonJS module or a Titanium specific compiled module.  If you use the Titanium specific module, you will need to follow the directory structure for modules (if specified in the project folder).


This example also demonstrates using the built-in selector engine to find a specific selector.

QUESTIONS
----------

- for the selector engine, since we might have different view hierarchies, do we need to define the `$` in each views controller scope instead of global?
