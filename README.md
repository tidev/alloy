# Alloy

**Latest stable version:** 1.2.0

Alloy is an MVC application framework by [Appcelerator](http://www.appcelerator.com) for [Titanium](http://www.appcelerator.com/platform).

Alloy will allow Titanium developers, old and new, to develop cross-platform mobile applications easier and more effectively than ever. The separation of concerns will increase the scalability of your apps. Titanium best practices are generated for you under the hood, making your apps of the highest quality across platforms. The markup, styles, themes, and mountain of other Alloy features will take your producitivity to a whole new level.

**_It's kind of a big deal._**

## Getting Started

* [Quick Start Guide](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Quick_Start) that covers _everything_ from installation to building your first app with Alloy.
* Complete collection of [Alloy Guides](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Framework)
* [Collection of test apps](https://github.com/appcelerator/alloy/tree/master/test/apps) showing various aspects of Alloy in practice.
* Join the [Alloy Google group](https://groups.google.com/forum/?fromgroups#!forum/appc-ti-alloy).

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

### from Titanium Studio

...oh yeah, Studio will do it for you automatically. :)

## Running Sample Test Apps

This is primarily done by Alloy devs just for testing purposes, but you may find it useful.

1. install jake: `[sudo] npm install -g jake`
	* If you are running nodejs 0.10.0, you **MUST** install jake 0.5.9 or higher.
2. Get into the root directory of the cloned alloy repository.
3. Find a test app in **test/apps** folder you want to run. For example, [basics/simple](https://github.com/appcelerator/alloy/tree/master/test/apps/basics/simple) or [models/todo](https://github.com/appcelerator/alloy/tree/master/test/apps/models/todo).
4. Run jake: `jake app:run dir=basics/simple`
	* You might get exceptions about uninstalled modules. If you do, simply install them by name: `[sudo] npm install -g MODULE_NAME`
5. Lather, rinse, repeat

### Importing the "Harness" to Titanium Studio

You can use these apps through Titanium Studio too. The easiest way to do that would be to import the **test/project/Harness** into Titanium Studio. After that, everytime you run `jake`, your project in Studio will be updated. Once in Studio, you can run for any platform, Titanium SDK version, or change any settings you want. This will give you a lot more options and power than running solely from the command line.

### Additional Notes

* Options for the `jake` command
	* **tiversion** - Set the Titanium SDK version to be used. Defaults to the latest installed SDK.
	* **platform** - The target mobile platform. Defaults to `iphone`. Must be `android` or `iphone`, `mobileweb` and `ipad` are not supported.
	* Examples
		* `jake app:run dir=basics/simple platform=iphone`
		* `jake app:run dir=basics/simple platform=android tiversion=3.0.0.GA`
		* `jake app:run dir=basics/simple tiversion=2.1.4`
* on OSX or Linux
    * Try using `sudo` with the `jake` command if you run into permission errors.
* on Windows
    * Due to a [bug in the titanium CLI](https://jira.appcelerator.org/browse/TIMOB-14933), when you run `jake app:run` the TiSDK 3.1.2.GA is automatically selected for you. Whether you use the default, or specify a new sdk with the `tiversion=VERSION` option, the version of the titanium CLI (`ti --version`) must match the version in your app's tiapp.xml file. By default, this value is also set to 3.1.2.GA in Alloy's test harness app's tiapp.xml file.
    * Don't run `jake` from within a user folder (i.e. `C:\Users\tony\alloy`), as you can get all kinds of non-obvious permissions failures from the child processing Alloy does. Your safest bet is to just `git clone` right to `C:\alloy`.
    * Node.js has [an issue piping output between node processes on Windows](https://github.com/joyent/node/issues/3584). I've tried to [workaround](https://github.com/joyent/node/issues/3584#issuecomment-23064579) as best I can. You may still see errors pop up, so it's suggested that if you run the automated testintg via `jake test:all` or `npm test`, you do so on a non-Windows OS to ensure there's no red herring failures until the aforementioned node.js issue is resolved.
    * If you decide to ignore my advice and run the tests anyway on Windows, make sure that if you imported the Harness into TiStudio that you _don't_ have TiStudio running. Windows creates locks on key files in that project that are necessary for the testing process. It will make tests fail erroneously.
    * If you're still that stubborn, are running the test suite on Windows, and you're getting those intermittent, erroneous errors, try running them one spec at a time. Instead of doing `jake test:all`, do `jake test:spec[SPEC_NAME]`, where `SPEC_NAME` is JS file in the [test specs folder](https://github.com/appcelerator/alloy/tree/master/test/specs).

## Feedback

More so than any other Appcelerator project to this point, we are working collaboratively with the community to develop a framework that works for you. Here's the best ways to discuss Alloy or ask questions.

* Got an Alloy development question? Go to the Appcelerator [Q&A](http://developer.appcelerator.com/questions/newest), and make sure to use the **alloy** tag.
* Want to discuss the past, present, and future of Alloy? Join the [Alloy Google group](https://groups.google.com/forum/?fromgroups#!forum/appc-ti-alloy).
* Got a confirmed bug? Log it at the [Titanium Community Issue Tracker](https://jira.appcelerator.org/browse/TC). Make sure to give it the **alloy** label.

Other than that, all the usual rules for submitting feedback apply. The more code, details, and test cases you provide, the easier it will be to act on that feedback.

## Contributing

Alloy is an open source project.  Alloy wouldn't be where it is now without contributions by the community. Please consider forking Alloy to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request.

To protect the interests of the Alloy contributors, Appcelerator, customers and end users we require contributors to sign a Contributors License Agreement (CLA) before we pull the changes into the main repository. Our CLA is simple and straightforward - it requires that the contributions you make to any Appcelerator open source project are properly licensed and that you have the legal authority to make those changes. This helps us significantly reduce future legal risk for everyone involved. It is easy, helps everyone, takes only a few minutes, and only needs to be completed once.

[You can digitally sign the CLA](http://bit.ly/app_cla) online. Please indicate your email address in your first pull request so that we can make sure that will locate your CLA.  Once you've submitted it, you no longer need to send one for subsequent submissions.

## Credits

Many credits should be noted in the development of Alloy.

- The Titanium community.  It's been a number of years and probably well over 50+ application frameworks that have been built around Titanium and we finally felt that it made sense for Appcelerator to work to build and support an official framework.  Thanks to everyone for their innovations, input and feedback.
- Jeff Haynie and Nolan Wright.  For their initial inspiration for Titanium and continued pushing to make it better. Codestrong.
- Kevin Whinnery.  For his passionate and persistent pushing to come up with a "standard way" and his many initial ideas.
- Russ McMahon. For his initial R&D work with Nolan to come up with the early versions and ideation.
- Tony Lukasavage.  For helping provide the JS ninja coding skills and for being the Alloy lead.
- Gabriel Tavridis. For helping provide the "herding of the engineering LOLcats" as the product manager for Alloy.

## Legal

Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.

