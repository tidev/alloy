Parsers for UI components

* default.js - Most tags are processed via the default.js parser. In fact, in most cases, the other parsers pre-process tags before invoking the default.js parser. This parser ultimately calls CU.generateNodeExtended() to create the actual code output to the app.
* _ProxyProperty* - parsers for properties of proxy objects, such as left/right nav buttons on iOS NavigationWindows.
* Alloy.Abstract.* - parsers for Alloy-specific tags that don't correspond to a Ti.UI.* object, such as &lt;FixedSpace> which generates a Ti.UI.Button with a specific subset of properties.

The rest of the parsers should be fairly obvious based on their names.

If you need to create a new parser, your best bet is to find a parser that's closest to what you need to use as a basis. There is no "template" from which you can create new parsers. Parsers should be minimalistic, doing only the required pre-processing before calling default.js.
