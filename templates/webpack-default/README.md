## Alloy

Here's how your Alloy directory is laid out.

models              your model files go here
controllers         your controllers files go here
views               yep, the views go here. you're getting it
styles              your style (.tss) files for your views go here
assets              All files here will be deployed into Resources
lib                 put your own libraries here and use require('@/name') to load it
migrations          generated model migrations go here
widgets             pre-built, reusable components for your Alloy apps.

Also, in the root is the config.json, this file is where you can declare runtime constants, and widget dependencies.

You'll also find a .vscode directory in your project root. It contains a settings.json file that hides folders that shouldn't be edited when developing Alloy applications. If you wish to see those folders then you can edit that file.

To get more help on Alloy check out the [Guides](https://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Guide), [How-tos](https://docs.appcelerator.com/platform/latest/#!/guide/Alloy_How-tos) and [API Docs](https://docs.appcelerator.com/platform/latest/#!/api/Alloy)
