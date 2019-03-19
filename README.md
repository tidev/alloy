# Alloy

[![Build Status](https://travis-ci.org/appcelerator/alloy.svg?branch=master)](https://travis-ci.org/appcelerator/alloy)
[![Dependency Status](https://david-dm.org/appcelerator/alloy.svg)](https://david-dm.org/appcelerator/alloy)
[![devDependency Status](https://david-dm.org/appcelerator/alloy/dev-status.svg)](https://david-dm.org/appcelerator/alloy#info=devDependencies)
[![NPM version](https://badge.fury.io/js/alloy.svg)](http://badge.fury.io/js/grunt-appc-js)

[![NPM](https://nodei.co/npm-dl/alloy.png)](https://nodei.co/npm/alloy/)

Alloy is an MVC application framework by [Appcelerator](http://www.appcelerator.com) for [Titanium](http://www.appcelerator.com/platform). More high-level details can be found here: [http://www.appcelerator.com/platform/alloy/](http://www.appcelerator.com/platform/alloy/)

## Getting Started

* [Quick Start Guide](http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Framework) that covers _everything_ from installation to building your first app with Alloy.
* Complete collection of [Alloy Guides](http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Framework)
* [Collection of sample apps](https://github.com/appcelerator/alloy/tree/master/samples/apps) showing various aspects of Alloy in practice.

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

Alloy includes many sample and test apps in the **sample/apps** folder (see above). For example, [basics/simple](https://github.com/appcelerator/alloy/tree/master/samples/apps/basics/simple). You can run these in a few different ways:

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

### C) Importing the "Harness" to Titanium Studio

You can use these apps through Titanium Studio too. The easiest way to do that would be to import the **test/project/Harness** into Titanium Studio. After that, everytime you run `jake`, your project in Studio will be updated. Once in Studio, you can run for any platform, Titanium SDK version, or change any settings you want. This will give you a lot more options and power than running solely from the command line.

## Additional Notes on Jake

* See the [jake readme](https://github.com/appcelerator/alloy/blob/master/jakelib/readme.md) for  information on using `jake` including the arguments and flags it accepts.
* on OSX or Linux
    * Try using `sudo` with the `jake` command if you run into permission errors.
* on Windows
    * Don't run `jake` from within a user folder (i.e. `C:\Users\tony\alloy`), as you can get all kinds of non-obvious permissions failures from the child processing Alloy does. Your safest bet is to just `git clone` right to `C:\alloy`.
    * Node.js has [an issue piping output between node processes on Windows](https://github.com/joyent/node/issues/3584). I've tried to [workaround](https://github.com/joyent/node/issues/3584#issuecomment-23064579) as best I can. You may still see errors pop up, so it's suggested that if you run the automated testing via `jake test:all` or `npm test`, you do so on a non-Windows OS to ensure there's no red herring failures until the aforementioned node.js issue is resolved.
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
 repo age : 6 years
 active   : 843 days
 commits  : 3799
 files    : 4075
 authors  : 
  2364	Tony Lukasavage        62.2%
   377	Feon Sua               9.9%
   374	Tim Poulsen            9.8%
    87	Fokke Zandbergen       2.3%
    87	Jeff Haynie            2.3%
    75	Russ McMahon           2.0%
    44	Ben Hatfield           1.2%
    38	Kevin Whinnery         1.0%
    32	Christopher Williams   0.8%
    30	Chris Barber           0.8%
    21	Carl Orthlieb          0.6%
    18	Ewan Harris            0.5%
    18	Michael                0.5%
    16	Kosuke Isobe           0.4%
    16	Xavier Lacot           0.4%
    15	Praveen Innamuri       0.4%
    13	Ingo Muschenetz        0.3%
    12	Hans Knöchel           0.3%
    11	Paul Mietz Egli        0.3%
    10	Tim Statler            0.3%
    10	Ng Chee Kiat           0.3%
     8	David Bankier          0.2%
     8	Issam Hakimi           0.2%
     8	Jong Eun Lee           0.2%
     6	Arthur Evans           0.2%
     6	bhatfield              0.2%
     5	Brenton House          0.1%
     4	Hazem Khaled           0.1%
     4	Martin Tietz           0.1%
     4	Joel Herron            0.1%
     4	Hans Knoechel          0.1%
     4	mukherjee2             0.1%
     4	Yordan Banev           0.1%
     3	Wilson Luu             0.1%
     3	Federico               0.1%
     3	Gary Mathews           0.1%
     2	miga                   0.1%
     2	Bryan Hughes           0.1%
     2	Michael Kåring         0.1%
     2	Aaron Saunders         0.1%
     2	Rene Pot               0.1%
     2	Marc Tamlyn            0.1%
     2	Iain Dawson            0.1%
     2	Davide Cassenti        0.1%
     1	farwayer               0.0%
     1	Ajay kumar Guthikonda  0.0%
     1	Anders D. Johnson      0.0%
     1	Andrew Blair           0.0%
     1	Andrew McElroy         0.0%
     1	Andrey Tkachenko       0.0%
     1	Brian Immel            0.0%
     1	Chris Gedrim           0.0%
     1	Clem                   0.0%
     1	Dan Frankowski         0.0%
     1	Dan Tamas              0.0%
     1	Daniel Mahon           0.0%
     1	Daniel Pfeifffer       0.0%
     1	Daniel Waardal         0.0%
     1	Family                 0.0%
     1	J. Tangelder           0.0%
     1	Jeff Antram            0.0%
     1	Jeremy Martin          0.0%
     1	Jorge Macías           0.0%
     1	João Teixeira          0.0%
     1	Kelly Nicholes         0.0%
     1	Kondal Kolipaka        0.0%
     1	Kota Iguchi            0.0%
     1	Lee, JongEun           0.0%
     1	Manuel Conde Vendrell  0.0%
     1	Manuel Lehner          0.0%
     1	Matthew Lanham         0.0%
     1	Mattijah               0.0%
     1	Micah Alcorn           0.0%
     1	Muhammad Dadu          0.0%
     1	Nuno Costa             0.0%
     1	Reymundo López         0.0%
     1	Sergey Nosenko         0.0%
     1	Vui Nguyen             0.0%
     1	ewieberappc            0.0%
     1	federico1525           0.0%
     1	gitizenme              0.0%
     1	godspeedelbow          0.0%
     1	hamasyou               0.0%
     1	jeffatstepup           0.0%
     1	longton95              0.0%
```

## Legal

Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.
