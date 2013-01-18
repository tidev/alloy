SIMPLE EXAMPLE
==============

This is the most basic example of a view and controller.

Any object defined in the view can be referenced in the controller by the id of the controller.

The goal of Alloy should be to favor convention over configuration, much like Ruby on Rails.  Since we are compiling Alloy applications into Titanium applications, we can provide the programmer with a nice environment where they don't need to write as much code.

For example, in Alloy, you should be required to only define one file at a minimum, which is the default view file, `index.xml`, which must be placed in the `views` folder.  

In Alloy, the controller (which is optional) must be named with the same name as the view with the `.js` file extension and placed in the `controllers` folder.

In alloy, you do not provide an `app.js` as it will be automatically generated.

In Alloy, any view styles will automatically be loaded from a file with the same name as the view and an `.tss` file extension and located in the `styles` directory.  The file format is JSON.  Each of the objects in the view that you want to be referenceable either through styling or programmatically must have an `id` attribute on the object.

You define a style in the JSON like this:


	"#a" : {
		"backgroundColor" : "red",
		"width": Ti.UI.FILL,
		"height": "100"
	},
	"#b" : {
		"width":Ti.UI.SIZE,
		"height":Ti.UI.SIZE
	},
	"#t" : {
		"width":Ti.UI.FILL,
		"height":Ti.UI.SIZE,
		"color":"black"
	}

	
And then you would define the view such as:

	<View id="a">
		<Button id="b">Hello</Button>
		<Label id="t"></Label>
	</View>

Note, you can use `Titanium.UI` constants in your Style (*.tss) file.

In your controller, you can reference the view such as:

	a.backgroundColor = "blue";
	b.addEventListener("click",function(e){
		t.text = "You clicked a button";
	});

All objects which have an `id` in your view will automatically be defined and available as a local variable in your controller.

Styles
------

You can use the following CSS attributes in your style name: Classes (prefix by `.`), Object Name (name of the Object Type such as `Button`) or ID (prefix by `#`).  The ID attribute will always take precedence.

For example:

	"Button": {
		"width":Ti.UI.SIZE,
		"height":Ti.UI.SIZE,
		"borderColor":"red"
	},
	
	".b" : {
		"width": "100",
		"b":true
	},
	
	".c" : {
		"height": "50",
		"b":false
	},
	
	"#b" : {
		"width": Ti.UI.FILL,
		borderColor:null
	}
	
With the following XML:

	<View>
		<Button id="b" class="b c" />
	</View>
	
Should result in the following code properties when merged:

	{
		"width": Ti.UI.FILL,
		"height":Ti.UI.SIZE,
		"b":false
	}
	
A few notes on the code generation and style merging:

- any `null` values will be removed in any final styles to optimize code generation.  
- classes can be separated by multiple spaces
- classes will be merged in order
- the order of precedence is like CSS: Object Type, Classes, ID where ID will override Classes and Classes will override Object Type



	