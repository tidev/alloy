# Alloy (0.3.4)

Alloy is an MVC application framework by [Appcelerator](http://www.appcelerator.com) for [Titanium](http://www.appcelerator.com/platform). 

Alloy will allow Titanium developers, old and new, to develop cross-platform mobile applications faster and cleaner than ever. The separation of concerns will increase the scalability of your apps. Titanium best practices are generated for you under the hood, making your apps more stable across platforms. The markup, styles, themes, and mountain of other Alloy features will take your producitivity to a whole new level.

**_It's kind of a big deal._**

### Wanna go straight to the [Quick Start Guide](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Quick_Start)?

### Looking for the full set of [Alloy Guides](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Framework)?

## Installation

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

## Running Sample Test Apps 

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

## Feedback

To our intrepid developers taking an early look at alloy, please consider the following when asking questions or citing concerns:

* If you want to pose an Alloy question to the whole community on [Q&A](http://developer.appcelerator.com/questions/newest), make sure to use the **alloy** tag.
* Using the [Titanium Community Issue Tracker](https://jira.appcelerator.org/browse/TC). Make sure to select the Alloy project when creating an issue.
* Using [Google Groups](https://groups.google.com/forum/?fromgroups#!forum/appc-ti-alloy). You'll need a gmail or Google Groups account 

Other than that, all the usual rules for submitting feedback apply. The more code, details, and test cases you provide, the easier it will be to act on that feedback.
	
## Credits

Many credits should be noted in the development of Alloy.

- The Titanium community.  It's been a number of years and probably well over 50+ application frameworks that have been built around Titanium and we finally felt that it made sense for Appcelerator to work to build and support an official framework.  Thanks to everyone for their innovations, input and feedback.
- Jeff Haynie and Nolan Wright.  For their initial inspiration for Titanium and continued pushing to make it better. Codestrong.
- Kevin Whinnery.  For his passionate and persistent pushing to come up with a "standard way" and his many initial ideas.
- Russ McMahon. For his initial R&D work with Nolan to come up with the early versions and ideation and for leading the Alloy team.
- Tony Lukasavage.  For helping provide the JS ninja coding skills and for being on the Alloy team.
- Gabriel Tavridis. For helping provide the "herding of the engineering LOLcats" as the product manager for Alloy.

## Legal

Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.

