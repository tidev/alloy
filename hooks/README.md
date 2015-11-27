## Alloy hooks

This directory contains plugins used by the CLI to process Alloy projects:

* alloy.js -- This is the main Alloy plugin. This hooks into the CLI at the `build.pre.compile` stage to perform the `alloy compile` operation. The Alloy compile generates the set of files in the Resources directory which the CLI then compiles into the finished app.
* deepclean.js -- This hook extends the `ti clean` command for Alloy projects, emptying both the build and Resources directories.

For more information on CLI hooks, see the [Titanium CLI Plugins](http://docs.appcelerator.com/platform/latest/#!/guide/Titanium_CLI_Plugins) guide.
