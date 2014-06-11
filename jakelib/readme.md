# Tips for the jake app:run command

Alloy includes a simple jake app-runner script that you can use to test the sample apps. You must run the `jake app:run` command from your Alloy repo directory. It requires one additional argument -- `dir` -- which points to the app's folder within test/apps.

In general form:

```shell
# general form
jake app:run dir=folder/appname

# for example
jake app:run dir=ui/tableview
```

You can pass any command-line argument supported by the `ti build` command (see <a href="http://docs.appcelerator.com/titanium/latest/#!/guide/Titanium_Command-Line_Interface_Reference-section-35619828_TitaniumCommand-LineInterfaceReference-Build">the docs</a>) with a couple of caveats:

* Do not include the single or double-dashes specified by the `ti build` command docs.
* Separate the argument and values with an equals sign, not a space.
* The `-p` or `--platform` argument defaults to ios for OS X users and android for Windows or Linux users. So, you can omit that argument if the default is suitable.
* If the `ti build` argument expects no value (such as `--tall`), you must specify a `true` value with the `jake` command.
* You can use either the `sdk` or `tiversion` argument to specify the CLI version to use with the build command. See note below.

Some examples:

```shell
jake app:run dir=basics/simple platform=mobileweb
jake app:run dir=basics/simple platform=ios sim-type=ipad
jake app:run dir=basics/simple platform=ios tall=true retina=true
jake app:run dir=ALOY-1000 # shortcut to run an app from test/apps/testing folder
``` 

## Note: SDK / Titanium version

The `sdk` argument to `ti build` specifies the version of the CLI that will be used to parse the tiapp.xml file. It does not override the sdk-version value specified in the tiapp.xml. However, for *only* the testing apps (test/apps/testing), that argument will specify the sdk-version. That's because those testing apps do not have an &lt;sdk-version> tag in their tiapp.xml file. The SDK version used is determined by either the command-line argument you supply to the `jake` command or the value you have set with the `ti sdk select` command.

