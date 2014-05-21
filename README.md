# Alloy

**Latest stable version:** 1.4.0

Alloy is an MVC application framework by [Appcelerator](http://www.appcelerator.com) for [Titanium](http://www.appcelerator.com/platform). More high-level details can be found here: [http://www.appcelerator.com/platform/alloy/](http://www.appcelerator.com/platform/alloy/)

## Getting Started

* [Quick Start Guide](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Quick_Start) that covers _everything_ from installation to building your first app with Alloy.
* Complete collection of [Alloy Guides](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Framework)
* [Collection of test apps](https://github.com/appcelerator/alloy/tree/master/test/apps) showing various aspects of Alloy in practice.
* Join the [Alloy Google group](https://groups.google.com/forum/?fromgroups#!forum/appc-ti-alloy).

## Installation

### from npm:

```bash
# install the latest stable
[sudo] npm install -g alloy

# install a specific version
[sudo] npm install -g alloy@1.4.0-alpha2

# install cutting edge directly from github
[sudo] npm install -g git://github.com/appcelerator/alloy.git
```

### from Titanium Studio

...oh yeah, Studio will do it for you automatically. :)

## Running Sample Test Apps

Apps are in the **test/apps** folder. For example, [basics/simple](https://github.com/appcelerator/alloy/tree/master/test/apps/basics/simple) or [models/todo](https://github.com/appcelerator/alloy/tree/master/test/apps/models/todo).

```bash
# clone the repo
git clone https://github.com/appcelerator/alloy.git
cd alloy

# install jake globally
[sudo] npm install -g jake

# install alloy globally from the cloned repo
[sudo] npm install -g .

# install alloy's local testing dependencies
npm install

# run a test app
jake app:run dir=basics/simple
```

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

## Contributors

```
 project  : alloy
 repo age : 1 year, 5 months ago
 commits  : 2564
 active   : 372 days
 files    : 1925
 authors  :
  2240  Tony Lukasavage         87.4%
    87  Jeff Haynie             3.4%
    75  Russ McMahon            2.9%
    38  Kevin Whinnery          1.5%
    24  Ben Hatfield            0.9%
    21  Carl Orthlieb           0.8%
    18  Fokke Zandbergen        0.7%
     8  Issam Hakimi            0.3%
     6  Chris Barber            0.2%
     6  Arthur Evans            0.2%
     5  David Bankier           0.2%
     5  Paul Mietz Egli         0.2%
     5  Xavier Lacot            0.2%
     4  Joel Herron             0.2%
     2  Aaron Saunders          0.1%
     2  Bryan Hughes            0.1%
     2  Davide Cassenti         0.1%
     2  Marc Tamlyn             0.1%
     2  miga                    0.1%
     1  Kelly Nicholes          0.0%
     1  Lee, JongEun            0.0%
     1  Ajay kumar Guthikonda   0.0%
     1  Matthew Lanham          0.0%
     1  Micah Alcorn            0.0%
     1  Daniel Waardal          0.0%
     1  Daniel Mahon            0.0%
     1  Andrew Blair            0.0%
     1  Anders D. Johnson       0.0%
     1  gitizenme               0.0%
     1  J. Tangelder            0.0%
```

## Legal

Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.

