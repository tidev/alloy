# Alloy

[![Build Status](https://travis-ci.org/appcelerator/alloy.svg?branch=master)](https://travis-ci.org/appcelerator/alloy)
[![Dependency Status](https://david-dm.org/appcelerator/alloy.svg)](https://david-dm.org/appcelerator/alloy)
[![devDependency Status](https://david-dm.org/appcelerator/alloy/dev-status.svg)](https://david-dm.org/appcelerator/alloy#info=devDependencies)
[![NPM version](https://badge.fury.io/js/alloy.svg)](http://badge.fury.io/js/grunt-appc-js)

[![NPM](https://nodei.co/npm-dl/alloy.png)](https://nodei.co/npm/alloy/)

Alloy is an MVC application framework by [TiDev](http://tidev.io) for [Titanium](https://titaniumsdk.com/). More high-level details can be found here: [https://github.com/tidev/alloy](https://github.com/tidev/alloy)

## Getting Started

-   [Quick Start Guide](https://titaniumsdk.com/guide/Alloy_Framework/) that covers _everything_ from installation to building your first app with Alloy.
-   Complete collection of [Alloy Guides](https://titaniumsdk.com/guide/Alloy_Framework)
-   [Collection of sample apps](https://github.com/tidev/alloy/tree/master/samples/apps) showing various aspects of Alloy in practice.

## Installation

### from npm:

```bash
# install the latest stable
[sudo] npm install -g alloy

# install a specific version
[sudo] npm install -g alloy@1.4.1

# install cutting edge directly from github
[sudo] npm install -g git://github.com/appcelerator/alloy.git
```

### from Axway Appcelerator Studio

...oh yeah, Studio will do it for you automatically. :)

## Running Sample Test Apps

Alloy includes many sample and test apps in the **sample/apps** folder (see above). For example, [basics/simple](https://github.com/tidev/alloy/tree/master/samples/apps/basics/simple). You can run these in a few different ways:

### A) With a regular Alloy installation

Beginning with Alloy 1.6, you can do the following:

```bash
# first, create a Titanium Classic project
titanium create --name yourAppName
cd yourAppName

# then, convert it to an Alloy project, using the test app as a template
alloy new . --testapp basics/simple
```

### B) By cloning the repo and using the Jake test runner

```bash
# first, clone the repo
git clone https://github.com/tidev/alloy.git
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

### C) Importing the "Harness" to Titanium Studio

You can use these apps through Titanium Studio too. The easiest way to do that would be to import the **test/project/Harness** into Titanium Studio. After that, everytime you run `jake`, your project in Studio will be updated. Once in Studio, you can run for any platform, Titanium SDK version, or change any settings you want. This will give you a lot more options and power than running solely from the command line.

## Additional Notes on Jake

-   See the [jake readme](https://github.com/tidev/alloy/blob/master/jakelib/readme.md) for information on using `jake` including the arguments and flags it accepts.
-   on OSX or Linux
    -   Try using `sudo` with the `jake` command if you run into permission errors.
-   on Windows
    -   Don't run `jake` from within a user folder (i.e. `C:\Users\tony\alloy`), as you can get all kinds of non-obvious permissions failures from the child processing Alloy does. Your safest bet is to just `git clone` right to `C:\alloy`.
    -   Node.js has [an issue piping output between node processes on Windows](https://github.com/joyent/node/issues/3584). I've tried to [workaround](https://github.com/joyent/node/issues/3584#issuecomment-23064579) as best I can. You may still see errors pop up, so it's suggested that if you run the automated testing via `jake test:all` or `npm test`, you do so on a non-Windows OS to ensure there's no red herring failures until the aforementioned node.js issue is resolved.
    -   If you decide to ignore my advice and run the tests anyway on Windows, make sure that if you imported the Harness into TiStudio that you _don't_ have TiStudio running. Windows creates locks on key files in that project that are necessary for the testing process. It will make tests fail erroneously.
    -   If you're still that stubborn, are running the test suite on Windows, and you're getting those intermittent, erroneous errors, try running them one spec at a time. Instead of doing `jake test:all`, do `jake test:spec[SPEC_NAME]`, where `SPEC_NAME` is JS file in the [test specs folder](https://github.com/tidev/alloy/tree/master/test/specs).

## Feedback

More so than any other Appcelerator project to this point, we are working collaboratively with the community to develop a framework that works for you. Here's the best ways to discuss Alloy or ask questions.

-   Got an Alloy development question? Go to the Appcelerator [Q&A](https://github.com/tidev/titanium_mobile/discussions), and make sure to use the **alloy** tag.
-   Got a confirmed bug? Log it at the [Titanium Community Issue Tracker](https://github.com/tidev/titanium_mobile/issues). Make sure to give it the **alloy** label.

Other than that, all the usual rules for submitting feedback apply. The more code, details, and test cases you provide, the easier it will be to act on that feedback.

## Contributing

Alloy is an open source project. Alloy wouldn't be where it is now without contributions by the community. Please consider forking Alloy to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request.

To protect the interests of the Alloy contributors, Appcelerator, customers and end users we require contributors to sign a Contributors License Agreement (CLA) before we pull the changes into the main repository. Our CLA is simple and straightforward - it requires that the contributions you make to any Appcelerator open source project are properly licensed and that you have the legal authority to make those changes. This helps us significantly reduce future legal risk for everyone involved. It is easy, helps everyone, takes only a few minutes, and only needs to be completed once.

[You can digitally sign the CLA](https://titaniumsdk.com/contribute.html) online. Please indicate your email address in your first pull request so that we can make sure that will locate your CLA. Once you've submitted it, you no longer need to send one for subsequent submissions.

## Legal

Alloy is developed by TiDev and the community and is Copyright (c) 2022 by TiDev, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2. See the [LICENSE](https://github.com/tidev/alloy/blob/master/LICENSE) file for more information.
