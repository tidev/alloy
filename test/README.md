## Test and demonstration apps

This folder contains testing and demonstration apps, as well as associated helpers.

* apps - Testing and demonstration apps
	* advanced - apps demonstrating more-advanced Alloy techniques
	* basics - apps demonstrating basic Alloy techniques
	* models - apps demonstrating the use of Models, Collections, and View-Model binding
	* testing - internal test apps used to verify tickets and development work
	* ui - apps demonstrating how to work with various UI componients
	* widgets - apps demonstrating how to use Widgets
* lib - Jasmine and related unit testing scripts for tests included with some apps
* projects - App stubs used by the `jake app:run` command for Alloy testing
	* Harness - A shell of a project to which the files in HarnessTemplate and the specific testing app are copied before being compiled and run.
	* HarnessTemplate - The actual base template files used when running the Alloy testing apps
* specs - unit tests for Alloy development