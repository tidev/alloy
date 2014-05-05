Maps
==========

The built-in maps module has been replaced by the Ti.Maps add-on module. This extension module is provided with the rest of the Titanium APIs, but not included in projects by default. Typically, you must add this module in your tiapp.xml. However, Alloy makes this easy ... if you use the `<Module>` tag.

In this example, we're going to show how we can use maps on iOS, Android, and MobileWeb.

You will need a reference to the Ti.Map object (the module or built-in object) throughout your app. The best way to do this is with the alloy.js file. In it, we'll add this line:

```
Alloy.Globals.Map = (OS_IOS || OS_ANDROID) ? require('ti.map') : Ti.Map;
```

That creates a reference to either the external module, or the built-in object, depending on your platform. Next, you will add the appropriate markup


```xml
<Module id="map" module="ti.map" method="createView" platform="ios,android"/>
<View ns="Ti.Map" id="map" platform="mobileweb/>
```

If you look to the index.xml file, you'll see how we're defining annotations with the `<Annotation>` tag. Map and annotation attributes can be specified in the view, style sheet, or controller.

**Note:** You must reference the appropriate object when referencing the map constants. Refer to the index.tss file to see how we reference the appropriate map object to set the mapType property to the appropriate constant.