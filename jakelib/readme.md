# Tips for the jake app:run command

Alloy includes a simple jake app-runner script that you can use to test the sample apps (the test apps included with Alloy). You must run the `jake app:run` command from your Alloy repo directory. It requires one additional argument -- `dir` -- which points to the app's folder within test/apps.

In general form:

```bash
# general form
jake app:run dir=folder/appname

# for example
jake app:run dir=ui/tableview
```

## Arguments and options
You can pass any command-line argument supported by the `ti build` command (see <a href="http://docs.appcelerator.com/platform/latest/#!/guide/Titanium_Command-Line_Interface_Reference-section-35619828_TitaniumCommand-LineInterfaceReference-Build">the docs</a>) with these caveats:

* Do _not_ include the single or double-dashes specified by the `ti build` command docs.
* You _must_ separate the argument and values with an **equals sign**, not a space.
* The `p` or `platform` argument defaults to `iphone` for OS X users and `android` for Windows or Linux users. So, you can omit that argument if the default is suitable.
* If the `ti build` option expects no value (such as its `--tall` flag), you must specify a `true` value when using it with the `jake` command.
* You can use either the `sdk` or `tiversion` argument to specify the CLI version to use with the build command. See note below.

## Xcode 6 / targeting specific simulators

Starting with SDK 3.4.0 and Xcode 6, you must target a desired simulator by its UUID.

```bash
# to get a list of UUIDs
ti info -t ios

# then build to a specific one
# this UUID corresponds to an iPad2 sim on my system
jake app:run dir=basics/simple C=A3B8061E-3F77-45B3-A697-509C46213B5F
```

## Targeting specific Android emulators

As with iOS simulators, you can target specific Android emulators; you do so by device name.

```bash
# to get a list of device names
ti info -t android

# then build to a specific one
# make sure to use quotes if the name has spaces
jake app:run dir=basics/simple platform=android C="Google Galaxy Nexus - 4.3 - API 18 - 720x1280"
```
## Running our Jira/ticket test apps

In your repo clone, you will find many test apps that correspond to Alloy Jira tickets. We use these when functionally testing Alloy changes. Because we run them so often, there's a shortcut syntax:

```bash
# for the Jira apps, the dir= part is optional
jake app:run dir=ALOY-1000
```



## Note: SDK / Titanium version

The `sdk` argument to `ti build` specifies the version of the CLI that will be used to parse the tiapp.xml file. It does not override the sdk-version value specified in the tiapp.xml.

However, for **the Alloy testing apps only**, that argument will specify the sdk-version. That's because those testing apps do not have an &lt;sdk-version> tag in their tiapp.xml file (see projects/HarnessTemplate/tiapp.xml).

For the Alloy test apps, the SDK version used to build your apps is determined by either the command-line argument you supply to the `jake` command or the value you have set with the `ti sdk select` command.
