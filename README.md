Alloy
=====

Alloy is a new application framework by [Appcelerator](http://www.appcelerator.com) for [Titanium](http://www.appcelerator.com/platform).

It provides a nice [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) framework for developers 
that are building Titanium apps.  

Current Status
--------------

*June 10, 2012* - _Unstable_


Goals
------

The following are the main goals for Alloy:

- *Productivity*: it's important that Titanium developers are productive and productive developers write less code. The main goal of Alloy is to provide a rapid framework for building robust applications.
- *Maintainability*:  it's important that Titanium apps can be maintained and sustained - not just by the original developer, but by others that are on the team, that come along afterwards or by others in the Titanium community.  Alloy should provide a framework that anyone can drop into and become productive once they understand the basics of Alloy.
- *Best Practices*: it's important that Alloy provide a clean separation of concerns for application design, provide a framework that encapsulates the best practices for Titanium and provides a mechanism for reusable application building blocks called `Widgets`.

Installation
-------------

Alloy is available as a Node.JS NPM module by running the following command:

	[sudo] npm install -g alloy

Local Installation
------------------

To install your own local copy (with executable), clone this repository, navigate to the top level directory, and install via:

	[sudo] npm install -g .
	
	
Creating an App
---------------

To create an Alloy enabled app, you must first create a project in Titanium Studio or via the Titanium CLI.  While in a console, 
navigate to the root directory of your application and run the following command in the console

	alloy new .
	
Alternatively, you can specify an argument as the second parameter to the location of a Titanium project directory.

As part of Alloy-enabling your Titanium project, Alloy will install a special compiler plugin that will help Studio or the CLI know how to use the Alloy compiler.  _NOTE: this currently only works on OSX and will be resolved prior to the production release._

Your new Alloy project will have a new folder named `app` that will contain the skeleton Alloy app.

Directory Structure
--------------------

Alloy has directories that should be familiar if you've used any of the popular web MVC frameworks like Ruby on Rails.  

Alloy prefers to use convention over configuration for simplicity.  

- *views* - this is where your views should go in the format _*view*.xml_
- *controllers* - this is where your controllers should go in the format _*view*.js_. 
- *styles* - this is where your view styling logic should go in the format _*view*.json_.
- *models* - this is where your model files will go.
- *assets* - this is where you should put your image assets and other misc. files that you want copied into the _Resources_ directory.
- *migrations* - this is where your database migration files will be stored.
- *lib* - this is where you should put application specific files, typically in the CommonJS format.
- *vendor* - this is where you should put any vendor specific modules, typically in the CommonJS format.  Do not place native modules in this folder.
- *config* - _RESERVED FOR FUTURE USE_.  This is currently not used but will eventually contain application specific config.

Compiling an App
----------------

You can run a Titanium project that is using Alloy like any normal build.  However, you can also use Alloy's command line tool to build from the command line.

	alloy compile

If you run this from the projects directory, it will compile the files to the correct location automatically.
	
	
Generating Views
-----------------

To generate an empty view and the associated style files, you can run the following command:

	alloy generate view <name>

Generating Controllers
---------------------

To generate an empty controller, you can run the following command:

	alloy generate controller <name>

Generating Models
---------------------

To generate a model, you can run the following command:

	alloy generate model <name> [column_name:type, ...]
	
For example:

	alloy generate model todo name:string active:boolean
	
When you generate a model, a migration file is automatically provided with the initial model details.

Generating Migrations
---------------------

To generate a standalone migration for a specific model, you can run the following command:

	alloy generate migration <name>

This will create a timestamp-ordered migration file for the model specified.	


Developing in Alloy
-------------------

You are required to only define one file at a minimum, which is the default view file, `index.xml`, which must be placed in the `views` folder.  

In Alloy, the controller (which is optional) must be named with the same name as the view with the `.js` file extension and placed in the `controllers` folder.

In alloy, you do not provide an `app.js` as it will be automatically generated.

In Alloy, any view styles will automatically be loaded from a file with the same name as the view and an `.json` file extension and located in the `styles` directory.  The file format is JSON.  Each of the objects in the view that you want to be referenceable either through styling or programmatically must have an `id` attribute on the object.

You define a style in the JSON like this:

```json
{
	"#a" : {
		"backgroundColor" : "red",
		"width": Ti.UI.FILL,
		"height": "100"
	},
	"#b" : {
		"width":Ti.UI.FIT,
		"height":Ti.UI.FIT
	},
	"#t" : {
		"width":Ti.UI.FILL,
		"height":Ti.UI.FIT,
		"color":"black"
	}
}
```
	
And then you would define the view such as:

```xml
<View id="a">
	<Button id="b">Hello</Button>
	<Label id="t"></Label>
</View>
```

Note, you can use `Titanium.UI` constants in your JSON file.

In your controller, you can reference the view such as:

```javascript
$.a.backgroundColor = "blue";
$.b.addEventListener("click",function(e){
	$.t.text = "You clicked a button";
});
```

All objects which have an `id` in your view will automatically be defined and available as a property in the special variable `$` in your controller.  For example, if you use the id `foo`, your object would be available as `$.foo`.

View Styling
-----------

Alloy separates the structural elements of a View from the styling components of the View -- much like the difference between HTML and CSS.  

You can use the following CSS attributes in your style name: Classes (prefix by `.`), Object Name (name of the Object Type such as `Button`) or ID (prefix by `#`).  The ID attribute will always take precedence.

For example:

```json
{
	"Button": {
		"width":Ti.UI.FIT,
		"height":Ti.UI.FIT,
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
		"borderColor":null
	}
}
```
	
With the following XML:

```xml
<View>
	<Button id="b" class="b c" />
</View>
```
	
Should result in the following code properties when merged:

```json
{
	"width": Ti.UI.FILL,
	"height":Ti.UI.FIT,
	"b":false
}
```
	
A few notes on the code generation and style merging:

- any `null` values will be removed in any final styles to optimize code generation.  
- classes can be separated by multiple spaces
- classes will be merged in order
- the order of precedence is: Object Type, Classes, ID

Titanium Namespacing
--------------------

By default, all UI components specified in your markup will be prefixed with the `Ti.UI` namespace for convenince. 

```xml
<Button id="mybutton">button title</Button>
```

The above snippet would create a `Ti.UI.Button`. If you want to add a UI component to your markup hierarchy that is _not_ part of the `Ti.UI` namespace, you can use the `ns` attribute.

```xml
<View ns="Ti.Map" id="map"/>
```

The above snippet would use `Ti.Map` as its namespace prefix, instead of the default `Ti.UI`, which would then give you a `Ti.Map.View` in your app.

De-composing complex Views
--------------------------

Alloy allows you to decompose a View into multiple subviews.  You would use the `require` attribute on a View element to import a separate view by name.  

```xml
<View>
	<View require="first" id="first"/>
	<View require="second" id="second"/>
	<View require="third" id="third"/>
</View>
```

In the above example, you should have 3 other view files named `first.xml`, `second.xml` and `third.xml`.  Of course, these subviews could also import their own subviews, too.

Working with Models & Collections
-----------------------------------

For models, we specify the schema of our model using JSON as the name of the model ending with `.json`.

You should generate a model using the `alloy generate model` command so that you can get automatic migration support.

All model classes are automatically defined and available in your controller scope as the name of the model.

For example, if you defined a model named `todo`, it would be available as the same variable name under the `$.` object.

To create a new model object:

```javascript
var todo = new $.Todo({
	name:"hello",
	done:false
});

todo.save();
```

Models inherit from Backbone.Model. _NOTE: if the first character of a model is lower case, it will be automatically converted to uppercase for referencing the Model class._

Collections of your models are automatically also created with the plural name of your model class. For example, if you defined a model named `todo`, you could automatically create a collection of models by using the following code:

```javascript
var list = new $.TodoCollection();
var results = list.find();
```

Collections inherit from Backbone.Collections.
	

Building Application Logic
--------------------------

In Alloy, you separate the application logic from the View logic (the `C` part of `MVC`) with `Controllers`.  

Controllers automagically will have pre-defined your View objects, as long as you've added a unique `id` attribute on the XML.

Each `id` value will reference the corresponding Titanium object in your controller automatically.

For example, if you have a view named `index.xml` with the following:

```xml
<View>
	<Button id="b"></Button>
</View>
```
	
You would then define a controller named `index.js` and you could automatically bind events inline in your controller code:

```javascript
$.b.addEventListener("click",function(){
	alert("You clicked the button");
});
```

If you don't add an `id` attribute to an element, it will not be referencable directly in your controller.

_NOTE: it's import that you use unique `id` attributes across all your view files.  If you don't, you will get a compiler error._

Exporting Properties & Functions from Controllers
-------------------------------------------------

Sometimes it's necessary to provide properties and functions in your controller that can be used by other controllers as a well defined API.

To export them, you would set the in the `exports` object which is predefined for you in your controller.

```javascript
exports.foo = function()
{
	return 'a';
}
```

You would then use the name of the controller to reference this method such as:

```javascript
$.index.foo();
```

Building Re-usable Application Widgets
---------------------------------------

Alloy supports the concept of a `widget` which is a package of MVC logic that can be reused inside an application.

The widget is defined in a separate 'widgets' subdirectory, but we would also support a widget distribution packaging much like modules today so that you could simply reference them and then they would automatically be found and imported either by searching for local widgets in the folder of the app or by scanning the titanium distribution, etc.

The widget would define its own views and controllers and they would work very similar to any normal application.

The widget controller would be able to export zero or more properties or methods that define the public interface for the widget.

Example of importing a widget:

```xml
<View>
	<Widget require="com.foo.widget" id="foo"/>
</View>
```

The widget view styles can also be imported by the views JSON file by using a special widget ID pattern: <#widget_id #id>.

For example, if the widget was imported to the name `foo` and the internal ID of a control was `b` - the reference would be '#foo:#b'.

If your widget would like to export properties and/or functions, it should assign them to the `exports` variable of the `widget.js`.

In your app controller, you would then be able to access them referencing the widget reference and the name of the property.

For example, in your `widget.js`:

```javascript
exports.calculatePie = function() 
{ 
	return 3.14; 
}
```
	
Now, if your widget reference was `foo` as in the example above, you would access your function in your app controller such as:

```javascript
$.foo.calculatePie();
```

See the [Widget Example](https://github.com/appcelerator/alloy/tree/master/examples/widget) for an example of building and using a widget.

_NOTE: we have not finalized the distribution packaging for an Alloy widget but it will be similar to native modules._


Conditional Code
-----------------

Alloy introduces a set of special variables which act like compiler directives.  If you use these compiler constants, your code will be optimized at code generation/compilation and any non-reachable code will be removed. This allows you to specify code blocks which are efficiently handled or dynamically processed based on these compiler constants.

The following are the constants which are defined by Alloy:

- *OS_IOS* : true if the current compiler target is iOS
- *OS_ANDROID*: true if the current compiler target is Android
- *OS_MOBILEWEB*: true if the current compiler target is Mobile Web
- *ENV_DEV*: true if the current compiler target is build for development (running in simulator/emulator)
- *ENV_TEST*: true if the current compiler target is build for test (run on device)
- *ENV_PRODUCTION*: true if the current compiler target is build for product (run after packaged for install)

Example of usage:

```javascript
if (ENV_DEV && OS_IOS)
{
	alert("You are running iOS in the simulator");
}
```

Per Project Build Customization
-------------------------------

Alloy provides an ability for the project to hook and customize the compile process using a special JS file in the project root directory named `alloy.jmk`.  This file can be used for common administration tasks or to fine tune the build process.  

The JMK file is loaded automatically by the Alloy command line during compilation.  To customize the build process, you call the `task` function with the event name and provide a function callback which will be called when the event is triggered by the compiler.

Currently, there are 3 main compiler tasks:

- *pre:compile* - called before the compiler gets started
- *post:compile* - called after the compiler is complete, but before it exits
- *compile:app.js* - called just after the compilation of the main app.js file but before the code is written to disk. you can return new code which will be used or `null` or `undefined` to write the code unchanged.

The function callback provides two arguments: `event` and `logger`.

The `event` object provides a set of values which may be useful for building tasks. 
The `logger` object provides a reference to the logger which defins the following methods: `debug`, `info`, `warn`, `error`.

An example of a build file:

```javascript
task("pre:compile",function(event,logger){
	logger.info('building project at '+event.projectDir);
});

task("post:compile",function(event,logger){
	logger.info('compile finished!');
});
```

Alloy compiler configuration
-----------------------------

You can control some settings of the compiler on a per project basis by modifying settings in the `alloy.json` in your root alloy app directory.


TODO
----

There's a lot of work to get Alloy to a release state.  The following are some of the major items:

- integration into Titanium Studio wizards
- DB migration support implementation [TEST]
- support for SQLite backed Model implementation [TEST]
- support for ACS backed Model implementation
- uglify all JS files, not just the app.js
- generation of scaffolding
- add support for TDD testing (possibly Jasmine?)
- possible view template support?
- full implementation of different views based on os, screen size, etc.
- widget packaging implementation, spec and tooling
- ability to better integrate native modules and reference them
- controller, view and model lifecycle events
	
Credits
-------

Many credits should be noted in the development of Alloy.

- The Titanium community.  It's been a number of years and probably well over 50+ application frameworks that have been built around Titanium and we finally felt that it made sense for Appcelerator to work to build and support an official framework.  Thanks to everyone for their innovations, input and feedback.
- Jeff Haynie and Nolan Wright.  For their initial inspiration for Titanium and continued pushing to make it better. Codestrong.
- Kevin Whinnery.  For his passionate and persistent pushing to come up with a "standard way" and his many initial ideas.
- Russ McMahon. For his initial R&D work with Nolan to come up with the early versions and ideation and for leading the Alloy team.
- Tony Lukasavage.  For helping provide the JS ninja coding skills and for being on the Alloy team.
- Gabriel Tavridis. For helping provide the "herding of the engineering LOLcats" as the product manager for Alloy.

Legal
------

Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.

