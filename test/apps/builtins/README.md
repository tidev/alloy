Builtins
========

In this example, we're going to show how we can use some of alloy's builtin JS libraries directly in your alloy JS files. These _builtins_ are meant to extend the base functionality of all your Titanium apps. The great thing about them is that only the builtins you need will be pulled into your generated Titanium project. The alloy compile process will survey your code and determine which builtins you will need at runtime.

The existing list of builtins can be found at: [https://github.com/appcelerator/alloy/tree/master/Alloy/builtins](https://github.com/appcelerator/alloy/tree/master/Alloy/builtins)

To use a builtin library in your code and have it automatically added to your generate Titanium project, all you need to do is require it with the `alloy` root diretory in your `require()` call. For example, if you wanted to include the `animation` builtin, all you need to do is this:

```javascript
var animation = require('alloy/animation');
```

Now you are free to use the builtin animation library in your code.
