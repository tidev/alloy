Multiplatform
=============

In this example, we demonstrate how to handle multi-platform conditional views and styles, as well as a compiler optimized constant (`OS_IPAD`).

The `styles` and `views` directories may contain one or more platform names which the compiler will use when compiling the 
application and determining which files to use.

In this example, we provide a default `index.js` and `index.json` which will be used if a platform specific folder isn't used. When
compiling for `iPad`, we will use the files in the `ipad` folder instead.

For the iPad, we are using a split view with a master-detail.  For other platforms, we just create 2 views which are divided 50% top to bottom.


COMPILER CONSTANTS
------------------

We also are going to provide a set of compiler constants such as `OS_IOS`, `OS_ANDROID`, `OS_IPAD`, `OS_IOS4`, `OS_IOS6`, `OS_ANDROID4`, etc.
This constants will be defined when we compile using Uglify.js and will strip out code during compile for non-related platforms.


TODO
----

- we should possibly support "handled" (phone),"midsize" (kindle), "tablet" (ipad, samsung), "tv" (google tv) or more generic form factor type conditionals too.
- should we have the user provide very high-res images and then create the different sizes during compile for high-res, low-res, etc?

