![Widget Header](img/header.png)

# BouncyLogo Widget
## Overview

The **BouncyLogo** widget provides a animated logo that is suitable for displaying when your application first starts.

## Manifest
* Version: 1.0 (stable)
* Github: https://www.github.com/appcelerator/alloy
* License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)
* Author: Carl Orthlieb
* Supported Platforms: iOS, Android, Mobile Web

## Adding the BouncyLogo Widget to Your Alloy Project

* In your application's config.json file you will want to include the following line in your dependencies:

```
"dependencies": {
    "com.appcelerator.bouncylogo":"1.0"
}
```
### Creating a Local Copy
Normally, BouncyLogo can be accessed without copying because it is part of Alloy, just adding it as a dependency to your project is enough. However, if you want to create a copy local to your application so that you can further modify it, then you will need to:

1.  Create a widgets directory in your app directory if it doesn't already exist.
2.  Copy the com.appcelerator.bouncylogo folder from the alloy/widgets directory into your app/widgets directory. 

## Adding the BouncyLogo to the View

You can add a bouncy logo to a view by using the *Widget* tag to bring in the BouncyLogo widget. 

	<Widget src="com.appcelerator.bouncylogo" id="logo"/>

Assign it an ID that you can use in your controller. E.g. `id="logo"` You can now access the BouncyLogo via `$.logo` in your controller. Note that the containing view needs to have a layout of "absolute", which is the default, and not "horizontal" or "vertical", in order to have BouncyLogo work properly. 

Note that the logo starts offscreen and hidden, you will need to initialize it after your window is open. Change your window to register for the `open` event if it has not already done so:

	<Window onOpen="IndexOpen">

## Initializing the BouncyLogo in the Controller

Note that your logo starts offscreen and hidden, you will need to initialize it after your window is open. During the open call you will want to call the BouncyLogo with the *init* method. For example:

```
function IndexOpen(e) {
    $.logo.init({ image: '/images/alloy.png', width: 216, height: 200 });
}
```
### Required Initialization Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| image | *string* | The logo image resource. |
| width | *integer* | Width of the logo. |
| height | *integer* | Height of the logo. |

### Optional Initialization Parameters

    opacity: 0.5,           // Fade into the background after it settles
    durationIn: 1000,        // Duration to slide onto the screen and become opaque
    durationBounce: 500,    // Duration to bounce before settling
    durationFade: 2000,     // Duration to fade to specified opacity
    bounciness: 0.25        // 0 = no bounce, 1 = full height bounce

There are number of aspects of the BouncyLogo that you can change, you can include these in your parameters when you call the init method.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| opacity | *number* | The final opacity of the logo once animation is complete. Default: *0.5* |
| durationIn | *integer* | The duration, in milliseconds, for the logo to slide onto the screeen. Default: *1000* |
| durationBounce | *integer* | The duration, in milliseconds, for the logo to bounce before settling. Default: *500* |
| durationFade | *integer* | The duration, in milliseconds, for the logo to fade after it has settled. Default: *2000* |
| bounciness | *number* | The "bounciness" of the animation, where 0 is no bounce and 1 is a full logo height bounce. Default: *0.25* |
| finishCallback | *function* | Callback to invoke once the logo has bounced in and animation is complete. |

## Future Work

There are lots of features that can be added to the BouncyLogo:

* Animating in from a different direction.
* Final position could be at different locations on the screen instead of centered.
* Handling higher resolution assets for tablets or other larger screen areas.

## Attributions
* Many thanks to Tony and Russ for enduring my numerous silly questions about Alloy.
* Appcelerator is an incredible place to work: full of passion and dedication bar none. My thanks to Jeff and Nolan for creating an amazing company.