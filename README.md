[![build status](https://secure.travis-ci.org/appcelerator/alloy.png)](http://travis-ci.org/appcelerator/alloy)
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

Quick Start
-----------

This quick start will give you the shortest path to installing Alloy and creating your first Alloy-driven project. It is  assumed that you have a working Titanium (Studio) environment. Check the [Titanium Quick Start](https://wiki.appcelerator.org/display/guides/Quick+Start) guide for setting that up first if you haven't done so already.

* Do this once:
	1. Download and install [Node.js](http://nodejs.org/), if necessary
	2. Downaload and install [npm](https://github.com/isaacs/npm/), if necessary 
	3. At the command line: `sudo npm install -g alloy`
* Do this for each project you create:
	4. Create a new mobile project in Titanium Studio, we'll call its path **PATH/TO/PROJECT**.
	5. `cd PATH/TO/PROJECT`
	6. `alloy new .`

After these steps, you can now run your projects in Titanium Studio. Be aware when working with an Alloy project that all files in your **Resources** directory are subject to being overwritten. All your work should be done in your project's **app** folder. 

If your new to Titanium development there is a web based guide to building your first Alloy app. To view the guide download the Alloy repository as a zip file, then open the zip file and in the docs/Alloy-bootstrap/folder you'll find the guide.

Environment requirements:
	Titanium SDK  2.1.0 and greater

At this point we only support Alloy development on OSX. 

Installation
-------------

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

	alloy new .
	
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
- *vendor* - this is where you should put any vendor specific modules, typically in the CommonJS format.  Do not place native modules in this folder.

Compiling an App
----------------

You can run a Titanium project that is using Alloy like any normal build.  However, you can also use Alloy's command line tool to build from the command line.

	alloy compile

If you run this from the projects directory, it will compile the files to the correct location automatically.

Debugging an App
----------------

Alloy apps can be debugged from within Titanium Studio by setting breakpoints in the generated controller in the Resources/alloy/controllers folder. 

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
	
When you generate a model, a migration file is automatically provided with the initial model details.

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

You define a style in the JSON like this:

```json
{
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
	"height":Ti.UI.SIZE,
	"b":false
}
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

For models, we specify the descriptor of our model using JSON as the name of the model ending with `.json`.

You should generate a model using the `alloy generate model` command so that you can get automatic migration support.

A model and collection class are automatically defined and available in your controller scope as the name of the model (name of descriptor JSON file).

For example, if you defined a model named `Book`, it would be available as the same name in Alloy using the methods Alloy.getCollection('Book') or Alloy.getModel('Book'). 

To create a new collection with a single model:

```javascript
var books = new (Alloy.getCollection('Book'));
var book = new (Alloy.getModel('Book'))({book:"Jungle Book", author:"Kipling"});
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

If you don't add an `id` attribute to an element, it will not be referencable directly in your controller.

The pattern for creating Alloy markup is to have the XML element name match the corresponding Titanium API name. Nested elements get added to parent element, for example the Button element below is added as a child to the Window element. Titanium styles are applied through the attributes of the style files described above.

```xml
<Window>
	<Button id="b"></Button>
</Window>
```

Exporting Properties & Functions from Controllers
-------------------------------------------------

Sometimes it's necessary to provide properties and functions in your controller that can be used by other controllers as a well defined API.

To export them, you would set the in the `$` object which is predefined for you in your controller.

```javascript
$.foo = function()
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
	<Require widgetid="com.foo.widget" id="foo"/>
</View>
```

The widget view styles can also be imported by the views JSON file by using a special widget ID pattern: <#widget_id #id>.

For example, if the widget was imported to the name `foo` and the internal ID of a control was `b` - the reference would be '#foo:#b'.

If your widget would like to export properties and/or functions, it should assign them to the `$` variable of the `widget.js`.

In your app controller, you would then be able to access them referencing the widget reference and the name of the property.

For example, in your `widget.js`:

```javascript
$.calculatePie = function() 
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

Running the Test Harness
------------------------

To run the sample Alloy apps in the included test harness, you will need to have the Jake build tool installed.  Jake is like Rake for Ruby, which itself is based on make.  Jake can be installed via npm:

	[sudo] npm install -g jake

To see which build targets are available, run `jake -T` at the top level project folder.  Sample Alloy apps are located in the `test/apps` directory.  Running a sample app from the command line (`jake app:run dir=masterdetail platform=iphone` e.g.) is supported for iOS and Android via `titanium.py` right now, provided you have a `TITANIUM_MOBILE_SDK` environment variable set.  Otherwise, you must pass in an `sdk` parameter pointing to your desired Titanium Mobile SDK location.

To run the samples via Studio, you must first copy over the appropriate Alloy app to the "Harness application".  There are Jake build targets set up for this purpose.  If you want to run the `no_ids` test app, for instance, you would first execute:

	jake app:setup dir=no_ids

Then, you could import the Harness project into Titanium Studio, and run the project as normal.  The Alloy compiler plugin is already configured.

Feedback
--------

To our intrepid developers taking an early look at alloy, please consider the following when asking questions or citing concerns:

* Alloy is currently unstable and changing rapidly. Expect turbulence.
* If you want to pose an Alloy question to the whole community on [Q&A](http://developer.appcelerator.com/questions/newest), make sure to use the **alloy** tag.
* Since Alloy is in its earliest stages, you may first want log your issues in the [Issues section of the Github repository](https://github.com/appcelerator/alloy/issues?state=open). That way core Alloy developers will have immediate visibility into your concerns.

Other than that, all the usual rules for submitting feedback apply. The more code, details, and test cases you provide, the easier it will be to act on that feedback.

Running a project from the command line
---------------------------------------

You can run the alloy and Titanium directly from the command line using the `run` command.

	alloy run
	
If you are inside a Alloy based Titanium project directory, you do not need to pass any additional parameters.  The run command takes 2 optional parameters:

	alloy run <directory> <platform>
	
Where `directory` is the project directory and `platform` is one of `iphone`, `android`, etc.

_NOTE: currently, this command is only available on OSX._

Running our test apps (OSX only)
--------------------------------

You may want to quickly see some of our [test apps](https://github.com/appcelerator/alloy/tree/master/test/apps) in action. Here's how to do it.

	cd /usr/local/lib/node_modules/alloy
	sudo jake app:run dir=widget_complex tiversion=2.1.1.GA

Notes:
* Make sure you use `sudo`, otherwise you'll get errors
* `dir` can be the name of any [test app](https://github.com/appcelerator/alloy/tree/master/test/apps)
* `tiversion` is optional. The latest installed Titanium SDK will be used if this option is omitted. 

TODO
----

There's a lot of work to get Alloy to a release state.  The following are some of the major items:

- integration into Titanium Studio wizards
- support for ACS backed Model implementation
- generation of scaffolding
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

