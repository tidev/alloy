Namespaces
==========

In this example, we're going to show how we can use Titanium UI components in the markup view hierarchy that our outside of the `Ti.UI` namespace. 

By default, all UI components in the markup view hierarchy are prefixed with the `Ti.UI` namespace when created. This is a convenience feature, as a vast majority of the components that compose most Titanium apps are contained within this namespace. 

```xml
<!-- Creates a Ti.UI.Button -->
<Button id="mybutton">button title</Button> 
```

There are, however, a few UI components outside this namespace. Some of those components include:

* Ti.Map.View & Ti.Map.Annotation
* Ti.Media.VideoPlayer & Ti.Media.AudioPlayer
* Ti.UI.Android.*
* Ti.UI.iPhone.*
* Ti.UI.iPad.*
* Ti.UI.iOS.*
* Ti.UI.MobileWeb.*

Accessing those components in your markup is simple. You just need to add the `ns` attribute to your markup element, with the desired namespace prefix as its value. So to create a `Ti.Map.View`, you'd do the following:

```xml
<View ns="Ti.Map" id="map"/>
```

It's that simple. The full example here does exactly that, and references the created `Ti.Map.View` component in the **index.js** controller to add annotations to the map.
