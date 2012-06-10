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
- *Maintainability*:  it's important that Titanium apps can be maintained and sustained - not just by the original developer, but by others tha are on the team, that come along afterwards or by others in the Titanium community.  Alloy should provide a framework that anyone can drop into and become productive once they understand the basics of Alloy.
- *Best Practices*: it's important that Alloy provide a clean separation of concerns for application design, provide a framework that encapsulates the best practices for Titanium and provides a mechanism for reusable application building blocks called `Widgets`.

Installation
-------------

	npm install alloy
	
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
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](LICENSE) file for more information.

