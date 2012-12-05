Alloy
=====

Alloy is a new application framework by [Appcelerator](http://www.appcelerator.com) for [Titanium](http://www.appcelerator.com/platform). It provides a nice [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) framework for developers that are building Titanium apps.  

Current Status
--------------

* 2012-12-06 - Alloy 0.3.3 released

Goals
------

The following are the main goals for Alloy:

- *Productivity*:   it's important that Titanium developers are productive and productive developers write less code. The main goal of Alloy is to provide a rapid framework for building robust applications.
- *Maintainability*:  it's important that Titanium apps can be maintained and sustained - not just by the original developer, but by others that are on the team, that come along afterwards or by others in the Titanium community.  Alloy should provide a framework that anyone can drop into and become productive once they understand the basics of Alloy.
- *Best Practices*: it's important that Alloy provide a clean separation of concerns for application design, provide a framework that encapsulates the best practices for Titanium and provides a mechanism for reusable application building blocks called `Widgets`.

Quick Start
-----------

### http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html

**NOTE:** _Be aware when working with an Alloy project that all files in your `Resources` directory are subject to being overwritten. All your work should be done in your project's `app` folder._ 

Installation
------------

Alloy is available as an npm module. So... you're gonna need [node.js](http://nodejs.org/).

### from npm:

```bash
[sudo] npm install -g alloy
```

### from source: 

```bash
git clone https://github.com/appcelerator/alloy.git
cd alloy
[sudo] npm install -g .
```

Creating an App
---------------

Alloy is a framework for [Titanium](http://www.appcelerator.com/platform/titanium-studio/), so if you don't have it, go get it!

To create an Alloy enabled app, you must first create a mobile project in Titanium Studio or via the Titanium CLI.  While in a console, navigate to the root directory of your application and run the following command in the console

```bash
alloy new [PATH]      # PATH is optional. It is the current working directory by default 
```

Your new Alloy project will have a folder named `app` that will contain the skeleton Alloy app.

Directory Structure
-------------------

Alloy has directories that should be familiar if you've used any of the popular web MVC frameworks like Ruby on Rails.  Alloy prefers to use convention over configuration for simplicity.  

- **views** - XML files that describe the layout of the UI.
- **controllers** - JS files that contain your app logic and Titanium API calls.
- **styles** - TSS files that contain the styling for your UI components defined in _views_. TSS files are a JSON derivative syntax that share many common conventiosn with CSS. They'll be discussed in more detail below.
- **models** - JS files that include the definition and extensions of [Backbone.js](http://backbonejs.org/)-based models and collections.
- **assets** - All your various project assets, like images, icons, data files, etc... Basically anything you want to end up in the Titanium `Resources` directory.
- **lib** - All of your JS libraries and commonjs modules. Like _assets_, these will also be copied to your Titanium `Resources` directory.

The following folders are not created automatically by Alloy but can be added for even more functionality.

- **migrations** - JS files that define model migrations
- **widgets** - These are self-contained, cross-platform, reusable components that can be dropped right into any Alloy project. More on these below.

Compiling an App
----------------

### in Titanium Studio:

There's nothing to do! Alloy will add a compiler plugin to your project automatically, which will take care of compiling your app with Alloy on every run.

_**CAVEAT:** Mobileweb does not support compiler plugins, so you'll need to follow the steps for command line compiling when building for Mobileweb._

### on the command line:

While in your Alloy app's project directory, execute the following command

```bash
alloy compile --config platform=mobileweb   # platform can be "android", "ios", or "mobileweb"
``` 

Running an App
----------------

You can run an Alloy app from the command line using the run command.
  
	alloy run

It defaults to the iPhone simulator but you can also specify a directory and platform.

  	alloy run [directory] [platform]

Where `directory` is the project directory and `platform` is one of `iphone`, `android`, and `mobileweb`.

Debugging an App
----------------

While Alloy apps are all generated from the code in the `app` directory, you can still use Titanium Studio's runtime debugging to debug your generated code, set breakpoints, etc... You will find all your generated code in the `Resources/alloy/controllers` folder. If you have models and/or widgets in your app, you'll also find generated code in `Resources/alloy/models` and `Resources/alloy/widgets` respectively.

_**NOTE:** We are actively persuing source mapping between the Alloy and generated code to allow you to do your runtime debugging right in your Alloy files. Stay tuned for that._

Generating Alloy Files
----------------------

```
bash 
# generates a view and style with the given NAME
alloy generate view NAME 

# generates a view, style, and controller with the give NAME
alloy generate controller NAME 

# generates a default widget with the given ID (i.e. com.appcelerator.mywidget)
alloy generate widget ID 

# generates an alloy.jmk for compiler pre and post hooks
alloy generate jmk 

# generates an empty migration file with the given NAME
alloy generate migration NAME

# generates a model with the given NAME and ADAPTER with column_name:column_type pairs
# More details in the following section
alloy generate model NAME ADAPTER [col1:type col2:type ...]
```

Generating Models
-----------------

To generate a model, you can run the following command:

	alloy generate model NAME ADAPTER col1:type col2:type ...
	
For example:

	alloy generate model todo sql name:string active:boolean

Adapters are the interface to the persistent storage for the model data. They do so by overriding the [sync](http://backbonejs.org/#Sync) function builtin to Backbone.js. The current list of adapters are shown below. Note: Not all adapters require the column definition.

* **sql** - Persistent storage via SQLite. _[Android,iOS]_
* **properties** - Persistent storage via Ti.App.Properties. _[Android,iOS,Mobileweb]_
* **localStorage** - Persistent storage via HTML5 localStarge. _[Mobileweb]_

Developing in Alloy
-------------------

All Alloy development happens in the `app` directory. MAKE NO CHANGES IN RESOURCES, THEY WILL GET DELETED! That includes the `app.js`. The main entry point for your Alloy app will be your `index.xml` file, and optionally its associated controller and styles, named `index.js` and `index.tss` respectively. 

Let's take a look at what a simple Hello World would look like in Alloy. We'll disect each section.

### index.xml
```xml
<Alloy>
    <Window>
    	<Label id="mylabel">Hello, World!</Label>
    </Window>
</Alloy>
```

### index.tss
```javascript
"Window": {
    backgroundColor: '#fff'
},
"#mylabel": {
    color: '#000',
    font: {
    	fontSize: '18dp',
    	fontWeight: 'bold'
    },
    height: Ti.UI.SIZE,
    width: Ti.UI.SIZE
}
```

### index.js
```javascript
// open the window from markup
$.index.open();

// alert the text of the label
alert($.mylabel.text);

exports.someExposedFunction = function () {}
```

Alloy XML View Markup
---------------------

```xml
<Alloy>
    <Window>
    	<Label id="mylabel">Hello, World!</Label>
    </Window>
</Alloy>
```

* Every Alloy XML view file is enclosed in an <Alloy> tag. No exceptions.
* The `index.xml` must have a single top-level UI component under <Alloy>. This is specific to the `index.xml`, all other views can have whatever UI format they want. Valid top-level UI components for `index.xml` are
	* Ti.UI.Window
 	* Ti.UI.TabGroup
  	* Ti.UI.iPad.SplitWindow
* That top-level UI component, if not explicitly given an `id` attribute, will get an `id` equal to the name of the view file. In the above case, the <Window> will receive the `id` of `index`.
* All UI components in markup with `id` attributes will be accessible in the associated controller, `index.js` in this case, on the `$` variable. This is shown in the controller's line: `alert($.mylabel.text);`
* `id`s must be unique in each view, but are not global. Two different views can have elements with the same `id`
* You can also use the more generic `class` attribute to help identify and group UI components.
* As you'll see below, IDed elements are referenced with the `#` prefix in TSS files, classes with the `.` prefix, just like CSS

Alloy TSS Styles
----------------

```javascript
"Window": {
    backgroundColor: '#fff'
},
"#mylabel": {
    color: '#000',
    font: {
    	fontSize: '18dp',
    	fontWeight: 'bold'
    },
    height: Ti.UI.SIZE,
    width: Ti.UI.SIZE
}
```

* Each style is associated by name with a view and controller
* You can create a global style that will be applied to all views/controllers by making a style in the `styles` folder named `app.tss`
* Each style definition is separated by a comma
* IDed elements are referenced with the `#` prefix in TSS files, classes with the `.` prefix, just like CSS
* You can apply styles to Titanium API components as well. For example, the `Window` style defined above will apply to any `Ti.UI.Window`
* Precedence: ID > class > Ti API > order of declaration
* Aside from the standard JSON valid values, TSS files can handle a few other values:
	* Titanium constants (i.e., `Ti.UI.SIZE` or `Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE`)
 	* The localization function `Ti.Locale.getString()` and its shorthand `L()`
  	* `expr()` which can contain any valid javascript which will get executed at runtime

Alloy JS Controllers
--------------------

```javascript
// open the window from markup
$.index.open();

// alert the text of the label
alert($.mylabel.text);

exports.someExposedFunction = function () {}
```

* This is where your standard app logic goes. Anything you can do in regular Titanium you can do here.
* All IDed markup elements are accessible on the `$` object
* You can expose a function publicly from the controllers by attaching it to the `exports` object
* Controller code is executed after your styles have been applied and the view hierarchy has been established

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

For models, we specify the descriptor of our model using Javascript as the name of the model ending with `.js`.

A model and collection class are automatically defined and available in your controller scope as the name of the model (name of descriptor Javascript file).

For example, if you defined a model named `Book`, it would be available as the same name in Alloy using the methods Alloy.createCollection('Book') or Alloy.createModel('Book'). 

To create a new collection with a single model:

```javascript
var books = Alloy.createCollection('Book');
var book = Alloy.createModel('Book', {book:"Jungle Book", author:"Kipling"});
books.add(book);
```

Models inherit from Backbone.Model. _NOTE: if the first character of a model is lower case, it will be automatically converted to uppercase for referencing the Model class._

Collections inherit from Backbone.Collections.

Make sure to check out the model samples under alloy/test/apps/model_apps to see how to create a model description. Also for advanced developers check out alloy/Alloy/lib/alloy/sync. There you will see the list of adapters. They provide the CRUD interface to the persistent store. They are dynamically loaded through the model descriptor and it's fairly straight for to create you own.  

Exporting Properties & Functions from Controllers
-------------------------------------------------

Sometimes it's necessary to provide properties and functions in your controller that can be used by other controllers as a well defined API.

```javascript 
exports.foo = function()
{
	return 'a';
}
```

You would then use the  Alloy.createController method to create a controller instance and call the exported method:

```javascript
var c = Alloy.createController("myControllerWithExports"); 
var value = c.foo(); // 'a' is returned
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

