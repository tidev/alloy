# Alloy

**Latest stable version:** 1.2.1

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
[sudo] npm install -g alloy@1.1.3

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
* If you get permissions errors on OSX or Linux, try using `sudo` with the `jake` command

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
 repo age : 1 year, 2 months ago
 commits  : 2439
 active   : 338 days
 files    : 1805
 authors  :
  1971	tonylukasavage          80.8%
   152	Tony Lukasavage         6.2%
    87	Jeff Haynie             3.6%
    75	Russ McMahon            3.1%
    38	Kevin Whinnery          1.6%
    24	Ben Hatfield            1.0%
    21	Carl Orthlieb           0.9%
    12	Fokke Zandbergen        0.5%
     8	Issam Hakimi            0.3%
     6	Arthur Evans            0.2%
     6	Chris Barber            0.2%
     5	Paul Mietz Egli         0.2%
     4	David Bankier           0.2%
     4	Xavier Lacot            0.2%
     4	Joel Herron             0.2%
     2	Aaron Saunders          0.1%
     2	Bryan Hughes            0.1%
     2	Davide Cassenti         0.1%
     2	Marc Tamlyn             0.1%
     2	miga                    0.1%
     1	Kelly Nicholes          0.0%
     1	Lee, JongEun            0.0%
     1	Ajay kumar Guthikonda   0.0%
     1	Matthew Lanham          0.0%
     1	Micah Alcorn            0.0%
     1	Daniel Waardal          0.0%
     1	Daniel Mahon            0.0%
     1	Andrew Blair            0.0%
     1	Anders D. Johnson       0.0%
     1	gitizenme               0.0%
     1	J. Tangelder            0.0%
     1	Family                  0.0%
```

## Legal

Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
Alloy is made available under the Apache Public License, version 2.  See the [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information.

