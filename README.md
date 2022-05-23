# Alloy

Alloy is an MVC application framework by [TiDev](https://tidev.io) for the [Titanium SDK](https://titaniumsdk.com).

## Getting Started

* [Quick Start Guide]([http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Framework](https://titaniumsdk.com/guide/Alloy_Framework/Alloy_Getting_Started.html)) that covers _everything_ from installation to building your first app with Alloy.
* Complete collection of [Alloy Guides]([http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Framework](https://titaniumsdk.com/guide/Alloy_Framework/Alloy_Guide/))
* [Collection of sample apps]([https://github.com/tidev/alloy/tree/master/samples/apps](https://titaniumsdk.com/guide/Alloy_Framework/Alloy_How-tos/Alloy_Samples.html)) showing various aspects of Alloy in practice.

## Installation

### from npm:

```bash
# install the latest stable
[sudo] npm install -g alloy

# install a specific version
[sudo] npm install -g alloy@1.4.1

# install cutting edge directly from github
[sudo] npm install -g git://github.com/tidev/alloy.git
```

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

## Additional Notes on Jake

* See the [jake readme](https://github.com/tidev/alloy/blob/master/jakelib/readme.md) for  information on using `jake` including the arguments and flags it accepts.
* on OSX or Linux
    * Try using `sudo` with the `jake` command if you run into permission errors.
* on Windows
    * Don't run `jake` from within a user folder (i.e. `C:\Users\tony\alloy`), as you can get all kinds of non-obvious permissions failures from the child processing Alloy does. Your safest bet is to just `git clone` right to `C:\alloy`.
    * Node.js has [an issue piping output between node processes on Windows](https://github.com/joyent/node/issues/3584). I've tried to [workaround](https://github.com/joyent/node/issues/3584#issuecomment-23064579) as best I can. You may still see errors pop up, so it's suggested that if you run the automated testing via `jake test:all` or `npm test`, you do so on a non-Windows OS to ensure there's no red herring failures until the aforementioned node.js issue is resolved.
    * If you decide to ignore my advice and run the tests anyway on Windows, make sure that if you imported the Harness into TiStudio that you _don't_ have TiStudio running. Windows creates locks on key files in that project that are necessary for the testing process. It will make tests fail erroneously.
    * If you're still that stubborn, are running the test suite on Windows, and you're getting those intermittent, erroneous errors, try running them one spec at a time. Instead of doing `jake test:all`, do `jake test:spec[SPEC_NAME]`, where `SPEC_NAME` is JS file in the [test specs folder](https://github.com/tidev/alloy/tree/master/test/specs).

## Contributing

Interested in contributing? There are several ways you can help contribute to this project.

### New Features, Improvements, Bug Fixes, & Documentation

Source code contributions are always welcome! Before we can accept your pull request, you must sign a Contributor License Agreement (CLA). Please visit https://tidev.io/contribute for more information.

### Donations

Please consider supporting this project by making a charitable [donation](https://tidev.io/donate). The money you donate goes to compensate the skilled engineeers and maintainers that keep this project going.

### Code of Conduct

TiDev wants to provide a safe and welcoming community for everyone to participate. Please see our [Code of Conduct](https://tidev.io/code-of-conduct) that applies to all contributors.

## Security

If you find a security related issue, please send an email to [security@tidev.io](mailto:security@tidev.io) instead of publicly creating a ticket.

## Stay Connected

For the latest information, please find us on Twitter: [Titanium SDK](https://twitter.com/titaniumsdk) and [TiDev](https://twitter.com/tidevio).

Join our growing Slack community by visiting https://slack.tidev.io

## Legal

Titanium is a registered trademark of TiDev Inc. All Titanium trademark and patent rights were transferred and assigned to TiDev Inc. on 4/7/2022. Please see the LEGAL information about using our trademarks, privacy policy, terms of usage and other legal information at https://tidev.io/legal.
