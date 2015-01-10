The Alloy folder contains the scripts used to compile an app.

Files:

* alloy.js -- the main entry point for Alloy
* logger.js -- logging class
* tiapp.js -- parser for the tiapp.xml file
* utils.js -- utilities and helpers

Directories:

* builtins -- scripts, such as moment or animation, that are available to app develpers to use within their Alloy projects
* commands -- Alloy's sub-commands, such as `alloy compile`
* common -- constants used within Alloy, such as base file names, file extensions, lists of platform-specific tags to be handled specially, etc.
* grammar -- TSS parsing helpers
* lib -- client-side libraries, such as the primary alloy.js client library and sync adapters
* plugin -- python plug-in for older CLI versions
* template -- templates for components created by `alloy generate` or for use by parsers when generating code

