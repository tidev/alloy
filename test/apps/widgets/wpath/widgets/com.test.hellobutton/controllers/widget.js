function sayHello() {
	// WPATH() will automatically make the path given to require() relative
	// to the widget's folder structure in the project. If you were to put
	// the path in manually, it would look like this:
	//
	//     require('com.test.mywidget/hello').sayHello();
	//
	// WPATH() should be used on any paths that refer to files included in
	// your widget from the "lib" or "assets" directory.
	require(WPATH('hello')).sayHello();
}