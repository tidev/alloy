Alloy
=====

Alloy is a new application framework by [Appcelerator](http://www.appcelerator.com) for [Titanium](http://www.appcelerator.com/platform).

It provides a nice [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) framework for developers 
that are building Titanium apps.  

Current Status
--------------

* 2012-06-10 - _Unstable_
* 2012-08-29 - _Pre-Release_

Release Notes
-------------

- When targeting Mobile Web you must do ```alloy compile``` from the command line before running the app.
- Alloy only runs on OSX. Windows and Linux support coming soon.


Goals
------

The following are the main goals for Alloy:

- *Productivity*: it's important that Titanium developers are productive and productive developers write less code. The main goal of Alloy is to provide a rapid framework for building robust applications.
- *Maintainability*:  it's important that Titanium apps can be maintained and sustained - not just by the original developer, but by others that are on the team, that come along afterwards or by others in the Titanium community.  Alloy should provide a framework that anyone can drop into and become productive once they understand the basics of Alloy.
- *Best Practices*: it's important that Alloy provide a clean separation of concerns for application design, provide a framework that encapsulates the best practices for Titanium and provides a mechanism for reusable application building blocks called `Widgets`.

Quick Start
-----------

### http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html

**NOTE:** _Be aware when working with an Alloy project that all files in your `Resources` directory are subject to being overwritten. All your work should be done in your project's `app` folder._ 

Manual Installation
-------------------

Alloy is available as a Node.JS NPM module by running the following command:

	[sudo] npm install -g alloy

Local Installation
------------------

To install your own local copy (with executable), clone this repository, navigate to the top level directory, and install via:

	[sudo] npm install -g .

Bleeding Edge
-------------

If you want to be using the latest version of Alloy at all times, here's what you can do:

	// do this once
	git clone https://github.com/appcelerator/alloy.git

	// do this frequently
	cd /path/to/alloy
	git pull origin master
	sudo npm install -g .

This will pull the latest changes from Alloy's repository and then install them locally via npm.

Creating an App
---------------

To create an Alloy enabled app, you must first create a project in Titanium Studio or via the Titanium CLI.  While in a console, 
navigate to the root directory of your application and run the following command in the console

	alloy new
	
Alternatively, you can specify an argument as the second parameter to the location of a Titanium project directory.

As part of Alloy-enabling your Titanium project, Alloy will install a special compiler plugin that will help Studio or the CLI know how to use the Alloy compiler.  _NOTE: this currently only works on OSX and will be resolved prior to the production release._

Your new Alloy project will have a new folder named `app` that will contain the skeleton Alloy app.

Directory Structure
-------------------

Alloy has directories that should be familiar if you've used any of the popular web MVC frameworks like Ruby on Rails.  

Alloy prefers to use convention over configuration for simplicity.  

- *views* - this is where your views should go in the format _*view*.xml_
- *controllers* - this is where your controllers should go in the format _*view*.js_. 
- *styles* - this is where your view styling logic should go in the format _*view*.json_.
- *models* - this is where your model files will go.
- *assets* - this is where you should put your image assets and other misc. files that you want copied into the _Resources_ directory.
- *migrations* - this is where your database migration files will be stored.


The following folders are not created automatically by Alloy but can be created and used by developers to add application libraries.

- *lib* - this is where you should put application specific files, typically in the CommonJS format.

Compiling an App
----------------

You can run a Titanium project that is using Alloy like any normal build.  However, you can also use Alloy's command line tool to build from the command line.

	alloy compile

If you run this from the projects directory, it will compile the files to the correct location automatically.

Running an App
----------------

You can run an Alloy app from the command line using the run command.
  
	alloy run

It defaults to the iPhone simulator but you can also specify a directory and platform.

  	alloy run [directory] [platform]

Where `directory` is the project directory and `platform` is one of `iphone`, `android`, and `mobileweb`.

Debugging an App
----------------

Alloy apps can be debugged from within Titanium Studio by setting breakpoints in the generated controller in the Resources/alloy/controllers folder. 

Deploying an App
----------------------

Deployment of Alloy apps is current done through Titanium Studio.

Generating Controllers
----------------------

To generate an empty controller, style and view file you can run the following command:

	alloy generate controller <name>

Generating Models
-----------------

To generate a model, you can run the following command:

	alloy generate model <name> [column_name:type, ...]
	
For example:

	alloy generate model todo name:string active:boolean
	

Generating Migrations
---------------------

To generate a standalone migration for a specific model, you can run the following command:

	alloy generate migration <name>

This will create a timestamp-ordered migration file for the model specified.	

Generating Widgets
------------------

To generate a basic widget, you run the following command

	alloy generate widget <name>

This will create a default widget in your projects's `app/widgets` path.

Developing in Alloy
-------------------

You are required to only define one file at a minimum, which is the default view file, `index.xml`, which must be placed in the `views` folder.  

In Alloy, the controller (which is optional) must be named with the same name as the view with the `.js` file extension and placed in the `controllers` folder.

In alloy, you do not provide an `app.js` as it will be automatically generated.

In Alloy, any view styles will automatically be loaded from a file with the same name as the view and an `.tss` file extension and located in the `styles` directory.  The file format is JSON.  Each of the objects in the view that you want to be referenceable either through styling or programmatically must have an `id` attribute on the object.

You define a style file (*.tss) like this:

```tss
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
```
	
And then you would define the view such as:

```xml
<View id="a">
	<Button id="b">Hello</Button>
	<Label id="t"></Label>
</View>
```

Note, you can use `Titanium.UI` constants in your *.tss file.

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

You can use the following selectors in your style name: Classes (prefix by `.`), Object Name (name of the Object Type such as `Button`) or ID (prefix by `#`).  The ID attribute will always take precedence.

For example:

```tss
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
		"borderColor":null
	}
```
	
With the following XML:

```xml
<View>
	<Button id="b" class="b c" />
</View>
```
	
Should result in the following code properties when merged:

```tss
	"width": Ti.UI.FILL,
	"height":Ti.UI.SIZE,
	"b":false
```
	
A few notes on the code generation and style merging:

- any `null` values will be removed in any final styles to optimize code generation.  
- classes can be separated by multiple spaces
- classes will be merged in order
- the order of precedence is: Object Type, Classes, ID
- You can put globals is a file called app.tss

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

Composing Views
---------------

Alloy allows you to compose a View utilizing multiple subviews.  You would use the `Require` element with the path set to the subview, the id is how you would access the subview within the container view.  

```xml
<Alloy>
	<Require src="first" id="first"/>
	<Require src="second" id="second"/>
	<Require src="third" id="third"/>
</Alloy>
```

In the above example, you should have 3 other view files named `first.xml`, `second.xml` and `third.xml`.  Of course, these subviews could also import their own subviews, too.

Working with Models & Collections
-----------------------------------

For models, we specify the descriptor of our model using JSON as the name of the model ending with `.json`.

A model and collection class are automatically defined and available in your controller scope as the name of the model (name of descriptor JSON file).

For example, if you defined a model named `Book`, it would be available as the same name in Alloy using the methods Alloy.createCollection('Book') or Alloy.createModel('Book'). 

To create a new collection with a single model:

```javascript
var books = Alloy.createCollection('Book');
var book = Alloy.createModel('Book', {book:"Jungle Book", author:"Kipling"});
books.add(book);
```

Models inherit from Backbone.Model. _NOTE: if the first character of a model is lower case, it will be automatically converted to uppercase for referencing the Model class._

Collections inherit from Backbone.Collections.
	
Building Application Logic
--------------------------

In Alloy, you separate the application logic from the View logic (the `C` part of `MVC`) with `Controllers`.  

Controllers automagically will have pre-defined your View objects, as long as you've added a unique `id` attribute on the XML.

Each `id` value will reference the corresponding Titanium object in your controller automatically.

For example, if you have a view named `index.xml` with the following:

```xml
<Window>
	<Button id="b"></Button>
</Window>
```
	
You would then define a controller named `index.js` and you could automatically bind events inline in your controller code:

```javascript
$.b.addEventListener("click",function(){
	alert("You clicked the button");
});

// "$.index" is the default variable for a top-level container inside the index.xml
$.index.open();
```

If you don't add an `id` attribute to an element, it will not be referenceable directly in your controller.

The pattern for creating Alloy markup is to have the XML element name match the corresponding Titanium API name. Nested elements get added to parent element, for example the Button element below is added as a child to the Window element. Titanium styles are applied through the selectors of the style files described above.

```xml
<Window>
	<Button id="b"></Button>
</Window>
```

Exporting Properties & Functions from Controllers
-------------------------------------------------

Sometimes it's necessary to provide properties and functions in your controller that can be used by other controllers as a well defined API.

To export them, you would use the CommonJS `exports` command.

```javascript 
exports.foo = function()
{
	return 'a';
}
```

You would then use the  Alloy.createController method to get the controller instance and call the exported method:

```javascript
var c = Alloy.createController("myControllerWithExports"); 
c.foo(); // 'a' is returned
```

Building Re-usable Application Widgets
---------------------------------------

Alloy supports the powerful concept of a `widget` which is a package of MVC logic that can be reused inside an application.

The widget would define its own views and controllers and they would work very similar to any normal application.

The widget controller would be able to export zero or more properties or methods that define the public interface for the widget.

Example of importing a widget:

```xml
<View>
	<Require type="widget" src="com.foo.widget" id="foo"/>
</View>
```

Any imported widgets need to be listed in the app/config.json file:

```json
    ...
	"dependencies": {
        "com.foo.widget":"1.0"
    }
```

The widget view styles can also be imported by the view's style file by using a special widget ID pattern: <#widget_id #id>.

For example, if the widget was imported to the name `foo` and the internal ID of a control was `b` - the reference would be '#foo:#b'.

If your widget would like to export properties and/or functions, it should use CommonJS `exports` command.

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

See the [Widget Example](https://github.com/appcelerator/alloy/tree/master/test/apps/widget) for an example of building and using a widget.

_NOTE: we have not finalized the distribution packaging for an Alloy widget but it will be similar to native modules. Currently we scan the project directory and the alloy/widgets directory to pull in the desired widgets._

Widget Assets
-------------

Widgets are to be self-contained components that can be easily dropped into Alloy-powered Titanium projects. For this reason, widgets can have their own collection of assets. These assets will be intelligently overlayed on your project's `Resources` directory at compile time. In this way, you can still specify platform-specific assets, yet keep these assets unique to your widget id.

For example, the following `app` folder structure for an alloy project:

```
app
- widgets
  - com.appc.testwidget
    - assets
      - iphone
        - images
          - myimage.png
          - myimage@2x.png
```

would be copied to your generated Titanium project as:

```
Resources
- iphone
  - images
    - com.appc.testwidget
      - myimage.png
      - myimage@2x.png
```

and those files could then be accessed in your widget's code and styles as: 

```javascript
var image = Ti.UI.createImageView({
	image: '/images/com.appc.testwidget/myimage.png'
});
```

This example shows only `iphone`, but widget assets can be copied to any path in the Resources directory. The final generated path will always have the widget's id as a folder, just before the file name. Here's a few more examples for clarity:

* `app/widgets/com.appc.mywidget/assets/images/cool.png` --> `Resources/images/com.appc.mywidget/cool.png`
* `app/widgets/com.appc.widget/images/android/images/res-hdpi/highresimage.png` --> `Resources/android/images/res-hdpi/com.appc.widget/highresimage.png`
* `app/widgets/com.appc.lastone/some/weird/path/file.txt` --> `Resources/some/weird/path/com.appc.lastone/file.txt`

Builtin JS LIbraries
--------------------

_builtins_ are meant to extend the base functionality of all your Titanium apps. The great thing about them is that only the builtins you need will be pulled into your generated Titanium project. The alloy compile process will survey your code and determine which builtins you will need to use at runtime.

The existing list of builtins can be found at: [https://github.com/appcelerator/alloy/tree/master/Alloy/builtins](https://github.com/appcelerator/alloy/tree/master/Alloy/builtins)

To use a builtin library in your code and have it automatically added to your generate Titanium project, all you need to do is require it with the `alloy` root diretory in your `require()` call. For example, if you wanted to include the `animation` builtin, all you need to do is this:

```javascript
var animation = require('alloy/animation');
```

Now you are free to use the builtin animation library in your code.

Project Configurations
----------------------

Alloy provides an ability to have project configurations stored as JSON which will be compiled and conditionalized at build time.
The configuration will be available in your app at runtime in the variable `Alloy.CFG`.  The config file is generated under the app folder with the name `config.json`.

In the config file, you can specify a set of global key/value pairs, as well as conditional configuration based on build environment and/or operating system target.  The order of precedence for key merging is `global`, `env` and then `os`.

_NOTE: The config file is also where you list you widget dependencies._

Example config:

```json
{
	"global":
	{
		"foo":1
	},
	
	"env:development":
	{
		"foo":2
	},

	"env:test":
	{
		"foo":3
	},

	"env:production":
	{
		"foo":4
	},
	
	"os:ios":
	{
		"foo":5
	},

	"os:android":
	{
		"foo":6
	},
	"dependencies": {
        "com.foo.widget":"1.0"
    }
}
```

Then, you can reference configuration at runtime in your code:

```javascript
alert(Alloy.CFG.foo);
```

In the above example, when running under the iOS simulator, you should see `5` in the alert dialog box.


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

Running Sample Test Apps 
------------------------

You can use the test harness to run your app or the sample [test apps](https://github.com/appcelerator/alloy/tree/master/test/apps) by using Jake. Jake is like Rake for Ruby. which itself is based on make. Jake should be installed automatically but if not do the following:

	sudo npm install -g jake

Sample Alloy apps are located in the `test/apps` directory.  To run a sample app from the command line you would first make sure you are at the top level of the alloy folder then run the following command,

    sudo jake app:run dir=builtins platform=iphone tiversion=2.1.0.GA

where `builtins` is the name of one of the sample apps and tiversion is the name of the installed Titanium SDK

To run the samples via Studio, you must first copy over the appropriate Alloy app to the "Harness application".  There are Jake build targets set up for this purpose. 

	jake app:setup dir=builtins

Then, you could import the Harness project into Titanium Studio, and run the project as normal. 

Notes:
* Make sure you use `sudo`, otherwise you'll get errors
* `dir` can be the name of any [test app](https://github.com/appcelerator/alloy/tree/master/test/apps)
* `tiversion` is optional. The latest installed Titanium SDK will be used if this option is omitted. 
* The default location on OSX of Alloy is: /usr/local/lib/node_modules/alloy 

Feedback
--------

To our intrepid developers taking an early look at alloy, please consider the following when asking questions or citing concerns:

* If you want to pose an Alloy question to the whole community on [Q&A](http://developer.appcelerator.com/questions/newest), make sure to use the **alloy** tag.
* Using the [Titanium Community Issue Tracker](https://jira.appcelerator.org/browse/TC). Make sure to select the Alloy project when creating an issue.
* Using [Google Groups](https://groups.google.com/forum/?fromgroups#!forum/appc-ti-alloy). You'll need a gmail or Google Groups account 

Other than that, all the usual rules for submitting feedback apply. The more code, details, and test cases you provide, the easier it will be to act on that feedback.

TODO
----

There's a lot of work to get Alloy to a production state.  The following are some of the major items:

- integration into Titanium Studio wizards
- support for ACS backed model 
- view template bindings support
- widget packaging spec and tooling
- better documentation (documentation team is working on this)
- improved debugging
	
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

