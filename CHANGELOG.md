## General Information:
* Install latest stable Alloy: `[sudo] npm install -g alloy`
* Install Alloy by version: `[sudo] npm install -g alloy@0.3.0`
* [Alloy Documentation](http://docs.appcelerator.com/titanium/3.0/#!/guide/Alloy_Framework)
* [Alloy on NPM](https://npmjs.org/package/alloy)


## 1.0.0-cr (8 February 2013)

### ** Breaking Changes **

The following changes alter the behavior of the Alloy Framework from previous versions and may
require code changes to your applications.

#### Titanium SDK Support

Alloy 1.0 only supports Titanium SDK 3.0 and later.  Previous versions of Alloy supported Titanium
SDK 2.1.x and later.


#### Backbone Events API Removed from View Proxies and Controllers

For Alloy View proxies and Controllers, that is, objects either referenced with `$.myid` or
created with `createController` and `getView` methods, you cannot use the Backbone Events 
API `on`, `off` and `trigger` methods to bind and unbind event callbacks, or fire events.
Use the Titanium SDK API `addEventListener`, `removeEventListener` and `fireEvent` methods instead.

Previously, Alloy View proxies and Controllers could use the Backbone Events API.

For Alloy Collection and Model objects, use the Backbone Events API not the Titanium SDK event
listener API. This has not changed from previous versions of Alloy.


#### Alloy Model-View Binding

Model-view binding with the Ti.UI.View proxy should be considered experimental.  On the iOS
platform, the view items are not being repopulated correctly. To follow this issue, see
[ALOY-485](https://jira.appcelerator.org/browse/ALOY-485).

Model-view binding with TableViews works fine and does not suffer from any known issues.

For more information, see the [Alloy Data Binding guide](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Data_Binding).


#### Custom Sync Adapter

If you created a custom sync adapter, the order of the passed parameters of the
`module.exports.sync` method
has changed to match the `Backbone.sync` method.

Prior to 1.0.0, the order was:

    module.exports.sync(model, method, options)

For 1.0.0 and later, the order is now:

    module.exports.sync(method, model, options)

To update your custom sync adapter, just switch the order of the `method` and `model` arguments.

Additionally, both the `module.exports.beforeModelCreate` and `module.exports.afterModelCreate`
methods accept an additional passed parameter--the name of the model file.

Prior to 1.0.0, the methods were:

    module.exports.beforeModelCreate(config)
    module.exports.afterModelCreate(Model)

For 1.0.0 and later, the methods are:

    module.exports.beforeModelCreate(config, name)
    module.exports.afterModelCreate(Model, name)

#### SQLite Sync Adapter and Migrations

The previous `sql` sync adapter has been replaced with the `sql_new` sync adapter as mentioned in
release 0.3.5.

If you have a model that uses the `sql` sync adapter from Alloy 0.3.6 and before, you need to
migrate
your data to the new table schema of the Alloy 1.0.0 SQLite sync adapter.

First, manually remove the following files from your Alloy project:

* Resources/alloy.js
* Resources/alloy/sync/sql.js 

Next, create a one-time migration file to transfer your model data to the new database schema.
Adapt the following code for your table schema.  Replace `title`, `author` and `isbn`
with your own specific table schema but leave `id` and `alloy_id` alone.  The order of fields does matter.
This migration file creates a temporary table, copies your current data to a temporary table,
deletes the old table from the database, creates a new table, then copies your data to the new table.

    migration.up = function(migrator) {
        var db = migrator.db;
        var table = migrator.table;
        db.execute('CREATE TEMPORARY TABLE book_backup(title,author,isbn,alloy_id);')
        db.execute('INSERT INTO book_backup SELECT title,author,isbn,id FROM ' + table + ';');
        migrator.dropTable();
        migrator.createTable({
            columns: {
                title:"TEXT",
                author:"TEXT",
                isbn:"INTEGER"
            },
        });
        db.execute('INSERT INTO ' + table + ' SELECT title,author,isbn,alloy_id FROM book_backup;');
        db.execute('DROP TABLE book_backup;');
    };
    
    migration.down = function(migrator) {
    
    }
    
Run your application once to migrate your data, then remove the migration file.

Note the `migrator.db` object in the previous example.  This object is a handle to a `Ti.Database` instance
to execute SQLite commands. DO NOT CLOSE THIS HANDLE OR OPEN A SECOND INSTANCE OF THE DATABASE.
This will cause fatal application errors.

See the [Alloy Sync Adapters and Migrations
guide](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Sync_Adapters_and_Migrations) for
information about the new SQLite sync adapter and the new migration features.

#### Removed ti.physicalSizeCategory Module

The `ti.physicalSizeCategory` module has been replaced by a background module part of Titanium SDK 3.0.x.
No action is needed to migrate to the new module.  However, your `tiapp.xml` file still references this module,
but does not affect the compilation or execution of the application.  You may safely remove this reference from your 
`tiapp.xml` file.

Previously, this module was copied to an Alloy project as part of the `alloy new` command 
and used to determine the size of an Android device.


#### Removed APIs

The following deprecated APIs have been removed in this release:

| API | Type | Notes |
|-----|------|-------|
| `Alloy.getCollection` | method | Creates a local instance of a collection. Use [Alloy.createCollection](http://docs.appcelerator.com/titanium/latest/#!/api/Alloy-method-createCollection) instead. |
| `Alloy.getController` | method | Creates a local instance of a controller. Use [Alloy.createController](http://docs.appcelerator.com/titanium/latest/#!/api/Alloy-method-createController) instead. |
| `Alloy.getModel` | method | Creates a local instance of a model. Use [Alloy.createModel](http://docs.appcelerator.com/titanium/latest/#!/api/Alloy-method-createModel) instead. |
| `Alloy.getWidget` | method | Creates a local instance of a widget. Use [Alloy.createWidget](http://docs.appcelerator.com/titanium/latest/#!/api/Alloy-method-createWidget) instead. |
| `Alloy.globals` | property | Global namespace. Use [Alloy.Globals](http://docs.appcelerator.com/titanium/latest/#!/api/Alloy-property-Globals) instead. | 
| `datatime.js` | builtin | Collection of functions for datetime formatting. Use [moment.js](http://docs.appcelerator.com/titanium/latest/#!/api/Alloy.builtins.moment) instead. |
| `size` | XML/TSS attribute | Defines size-specific view components or styles. Use the `formFactor` attribute instead. |

### New features

* [ALOY-343](https://jira.appcelerator.org/browse/ALOY-343). Facilitate Alloy code completion in Studio.
* [ALOY-437](https://jira.appcelerator.org/browse/ALOY-437). Support Android fastdev.
* [ALOY-475](https://jira.appcelerator.org/browse/ALOY-475). Create test app for testing sql adapter apps with no migrations.


### Bug fixes and improvements

* [ALOY-209](https://jira.appcelerator.org/browse/ALOY-209). Remove ti.physicalSizeCategory module for Alloy 1.0.0 (TiSDK 3.0+). Fixes [ALOY-188](https://jira.appcelerator.org/browse/ALOY-188) and [ALOY-134](https://jira.appcelerator.org/browse/ALOY-134).
* [ALOY-313](https://jira.appcelerator.org/browse/ALOY-313). Use applyProperties to assign properties to Ti.Android.MenuItem in parser.
* [ALOY-323](https://jira.appcelerator.org/browse/ALOY-323). Make Alloy support only TiSDK 3.0+.
* [ALOY-407](https://jira.appcelerator.org/browse/ALOY-407). Make `alloy generate model` calls uniform in format, regardless of adapter. Fixes [ALOY-375](https://jira.appcelerator.org/browse/ALOY-375) where models were not being generated correctly in Titanium Studio.
* [ALOY-429](https://jira.appcelerator.org/browse/ALOY-429). Convert jake app runner to use new CLI.
* [ALOY-454](https://jira.appcelerator.org/browse/ALOY-454). iOS is rebuilding apps every time with new CLI.
* [ALOY-455](https://jira.appcelerator.org/browse/ALOY-455). Remove Backbone eventing from Titanium proxies. Fixes [ALOY-460](https://jira.appcelerator.org/browse/ALOY-460) where ScrollableViews displayed noticeable lagging.
* [ALOY-457](https://jira.appcelerator.org/browse/ALOY-457). Make Alloy sync adapter sync() function signature match that of Backbone.
* [ALOY-473](https://jira.appcelerator.org/browse/ALOY-473). Abort compile process with message if trying to compile Alloy 1.0+ for anything less than Titanium 3.0.
* [ALOY-476](https://jira.appcelerator.org/browse/ALOY-476). Widgets within model-bound view get bound to unexisting `$model`.
* [ALOY-479](https://jira.appcelerator.org/browse/ALOY-479). Fix migration processing bug.
* [ALOY-480](https://jira.appcelerator.org/browse/ALOY-480). Replace `sql` adapter with `sql_new`.
* [ALOY-482](https://jira.appcelerator.org/browse/ALOY-482). View-based collection binding not properly clearing children before repopulating.
* [ALOY-486](https://jira.appcelerator.org/browse/ALOY-486). `sql` adapter does not update ID in client-side model when using AUTOINCREMENT.


### Deprecations

* [ALOY-330](https://jira.appcelerator.org/browse/ALOY-330). Make `alloy run` execute `titanium build`. The `alloy run` command will be removed in version 1.1.0 in favor of only using the `titanium build` command of the Titanium CLI.



## 0.3.6 (18 January 2013)

### Bug fixes and improvements

* [ALOY-474](https://jira.appcelerator.org/browse/ALOY-474). Allow extra commas in TSS files.


## 0.3.5 (18 January 2013)

### New features

* Tons of sql sync adapter features and fixes
	* **IMPORTANT**: Please read the [notes on the sql_new adapter](https://github.com/appcelerator/alloy/edit/master/CHANGELOG.md#additional-notes-for-035) below.
	* [ALOY-458](https://jira.appcelerator.org/browse/ALOY-458). The sql adapter now allows you to execute custom queries on fetch(). The [models/sql_queries](https://github.com/appcelerator/alloy/tree/master/test/apps/models/sql_queries) test app uses this, specifically in this [controller file](https://github.com/appcelerator/alloy/blob/master/test/apps/models/sql_queries/controllers/main.js). 
	* [ALOY-447](https://jira.appcelerator.org/browse/ALOY-447). Alloy Model column definitions now support SQLite keywords, like PRIMARY KEY and AUTOINCREMENT. The [models/sql_keywords](https://github.com/appcelerator/alloy/tree/master/test/apps/models/sql_keywords) test app shows how to use it.
	* [ALOY-467](https://jira.appcelerator.org/browse/ALOY-467). idAttribute is now assignable from the model.js file's definition object. The [models/sql_keywords](https://github.com/appcelerator/alloy/tree/master/test/apps/models/sql_keywords) test app, specifically this [model file](https://github.com/appcelerator/alloy/blob/master/test/apps/models/sql_keywords/models/fighters.js) shows how to use it to identify which column in your table is the unique identifier for syncing between SQLite and Backbone.
	* [ALOY-453](https://jira.appcelerator.org/browse/ALOY-453). Full support for up() and down() migrations in sql adapter. [models/sql_keywords](https://github.com/appcelerator/alloy/tree/master/test/apps/models/sql_keywords) is also a multiple migration test app.
	* [ALOY-345](https://jira.appcelerator.org/browse/ALOY-345). sql adapter databases can now be preloaded from a database file. The [models/sql_preload](https://github.com/appcelerator/alloy/tree/master/test/apps/models/sql_preload) test app shows how.
	* [ALOY-456](https://jira.appcelerator.org/browse/ALOY-456). sql adapter now supports multiple SQLite databases. The [model/sql_queries](https://github.com/appcelerator/alloy/tree/master/test/apps/models/sql_queries) test app makes use of multiple SQLite databases. 
	* [ALOY-468](https://jira.appcelerator.org/browse/ALOY-468). Added insertRow() and deleteRow() functions to migration object. You can see these in use for prepopulating and deleting rows in this [migration file](https://github.com/appcelerator/alloy/blob/master/test/apps/models/sql_queries/migrations/201301161234567_user.js) of the [models/sql_queries](https://github.com/appcelerator/alloy/tree/master/test/apps/models/sql_queries) test app. 
* TSS parsing and features
	* [ALOY-272](https://jira.appcelerator.org/browse/ALOY-272). TSS parsing is now grammar based. Makes [code assist in TiStudio](https://jira.appcelerator.org/browse/ALOY-389) possible.
	* [ALOY-252](https://jira.appcelerator.org/browse/ALOY-252). Commas are now optional between top-level style objects in TSS files. Check this [style file](https://github.com/appcelerator/alloy/blob/master/test/apps/models/sql_queries/styles/app.tss) for an example.
	* [ALOY-452](https://jira.appcelerator.org/browse/ALOY-452). expr() syntax has been removed from TSS files. Here is the [cleaner and more powerful alternative](https://github.com/appcelerator/alloy/commit/e9fdc93c9760a1590c0abd0136662c11dc678066#commitcomment-2401085) for using runtime values in TSS files.
* [ALOY-284](https://jira.appcelerator.org/browse/ALOY-284). Titanium constants can now be used as XML attributes in markup. Check this [view xml file](https://github.com/appcelerator/alloy/blob/master/test/apps/testing/grammar/views/index.xml) for an example. 

### Bug fixes and improvements

* [ALOY-191](https://jira.appcelerator.org/browse/ALOY-191). The [models/todo](https://github.com/appcelerator/alloy/tree/master/test/apps/models/todo) test app now works with all supported sync adapters \(sql, properties, localStorage\).
* [ALOY-336](https://jira.appcelerator.org/browse/ALOY-336). Mobileweb logs not showing up in console \(related to [TISTUD-2525](https://jira.appcelerator.org/browse/TISTUD-2525)\).
* [ALOY-449](https://jira.appcelerator.org/browse/ALOY-449). Parsing state not cleaned properly when processing multiple top-level UI elements.
* [ALOY-446](https://jira.appcelerator.org/browse/ALOY-446). sql adapter should open/close between all operations (best practices).

### Additional Notes for 0.3.5

Due to the massive amount of changes in the sql adapter, it is being introduced as ["sql_new"](https://github.com/appcelerator/alloy/blob/master/Alloy/lib/alloy/sync/sql_new.js). This is the "type" you would use in your model definitions, as seen in this [model from the models/sql_queries](https://github.com/appcelerator/alloy/blob/master/test/apps/models/sql_queries/models/user.js) test app. The unchanged "sql" adapter still exists temporarily for compatibility. 

All freshly built apps will work with the **sql_new** adapter, including all the sql ones in the [test/apps/models folder](https://github.com/appcelerator/alloy/tree/master/test/apps/models) in the repo. There _may_ be conflicts, though, if you attempt to just drop the **sql_new** adapter on an app that has been previously using the old **sql** adapter. This is because **sql_new** uses a different, smarter, less invasive means of identifying the unique id of your sql records, adding an "alloy_id" column only if absolutely necessary. If you can delete your existing sql storage and just rebuild it, then all you need to do is delete and then you can start using the **sql_new** adapter. If not, we'll have a migration guide soon.

**One final important note** is that the old **sql** adapter will be replaced with **sql_new** when Alloy 1.0.0 is released, tentatively scheduled for mid-February. This'll give you a month to try it out and migrate data if necessary. Any questions or concerns, hit me up at the [google group](https://groups.google.com/forum/?fromgroups#!forum/appc-ti-alloy).

## 0.3.4 (20 December 2012)

### Important Note for Model/Collection Binding Feature

* [ALOY-432](https://jira.appcelerator.org/browse/ALOY-432). Added $.destroy() function to all controllers. When using model/collection binding in a controller, you **MUST** call this when closing a controller to prevent potential memory leaks. This is especially true if your binding makes references to global models/collections. More detailed documentation on this point will be added to the [Alloy Data Binding Guide](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Models-section-34636390_AlloyModels-DataBinding) very soon. \([TEST APP](https://github.com/appcelerator/alloy/tree/master/test/apps/models/binding_destroy)\)

### New features
* [ALOY-394](http://jira.appcelerator.org/browse/ALOY-394). Support collection binding on Views, allowing for arbitrary component repetition. \([TEST APP](https://github.com/appcelerator/alloy/tree/master/test/apps/models/journal)\)
* [ALOY-103](http://jira.appcelerator.org/browse/ALOY-103). Support model binding of models to discrete properties on UI components. \([TEST APP](https://github.com/appcelerator/alloy/tree/master/test/apps/models/login)\)
* [ALOY-382](http://jira.appcelerator.org/browse/ALOY-382), [ALOY-383](https://jira.appcelerator.org/browse/ALOY-383). Support in markup for proxy properties, like rightNavButton, leftNavButton, titleControl, etc... \([TEST APP](https://github.com/appcelerator/alloy/tree/master/test/apps/ui/proxy_properties)\)
* [ALOY-387](http://jira.appcelerator.org/browse/ALOY-387), [ALOY-388](https://jira.appcelerator.org/browse/ALOY-388). Support view (XML) and controller (JS) code completion in Titanium Studio.
* [ALOY-421](http://jira.appcelerator.org/browse/ALOY-421). Add moment.js as builtin. Deprecates datetime.s builtin.

### Bug fixes and improvements
* [ALOY-342](http://jira.appcelerator.org/browse/ALOY-342). Support '--platform' option with 'alloy generate' command to create platform-specific views and controllers.
* [ALOY-359](http://jira.appcelerator.org/browse/ALOY-359), [ALOY-423](http://jira.appcelerator.org/browse/ALOY-423). Improve buttongrid widget and fix a memory leak.
* [ALOY-361](http://jira.appcelerator.org/browse/ALOY-361). Fix a bug with style prioritization as it relates to the formFactor attribute.
* [ALOY-420](http://jira.appcelerator.org/browse/ALOY-420). Refactor TableView parser to allow model-bound tables to use proxy properties.
* [ALOY-430](https://jira.appcelerator.org/browse/ALOY-430). Collection binding now responds to the Backbone "reset" event.
* [ALOY-433](https://jira.appcelerator.org/browse/ALOY-433). Removed "unreachable code" warning in production Android builds.
* [ALOY-436](https://jira.appcelerator.org/browse/ALOY-436). Alloy compile failures will now abort the Titanium build process, as expected, with the Titanium 3.0+ SDK.
* [ALOY-438](https://jira.appcelerator.org/browse/ALOY-438). Fixed bug where the Backbone off() function on Titanium proxies created from markup was not working.


## 0.3.3 (6 December 2012)

### New features
* [ALOY-104](http://jira.appcelerator.org/browse/ALOY-104). Enable Model-View binding on TableViews. For more information, see the basic [tableview_binding test app](https://github.com/appcelerator/alloy/tree/master/test/apps/models/tableview_binding) or the slightly more complete [todo_binding sample app](https://github.com/appcelerator/alloy/tree/master/test/apps/models/todo_binding) which shows how to do data filtering and transformations on bound data.

    **NOTE:** This is brand new stuff with lots more functionality coming, so any feedback on the current state is very welcome. It's best to let us know at the [Alloy google group](https://groups.google.com/forum/?fromgroups#!forum/appc-ti-alloy).
* [ALOY-312](http://jira.appcelerator.org/browse/ALOY-312). Update Underscore.js to version 1.4.2 and Backbone.js to minified production 0.9.2 version.
* [ALOY-367](http://jira.appcelerator.org/browse/ALOY-367), [ALOY-377](http://jira.appcelerator.org/browse/ALOY-377). Support Soasta touch test.
* [ALOY-373](http://jira.appcelerator.org/browse/ALOY-373), [ALOY-379](http://jira.appcelerator.org/browse/ALOY-379). Add Collection tag in markup to create a singleton or instance(s) of a collection.
* [ALOY-390](http://jira.appcelerator.org/browse/ALOY-390), [ALOY-391](http://jira.appcelerator.org/browse/ALOY-391). Add Model tag in markup to create a singleton or instance(s) of a model.
* [ALOY-396](http://jira.appcelerator.org/browse/ALOY-396), [ALOY-397](http://jira.appcelerator.org/browse/ALOY-397), [ALOY-156](http://jira.appcelerator.org/browse/ALOY-156). Add completion callback to all methods in the animation.js builtin library.

### Bug fixes and improvements
* [ALOY-311](http://jira.appcelerator.org/browse/ALOY-311). Improve Ti.UI.Android.MenuItem parser.
* [ALOY-370](http://jira.appcelerator.org/browse/ALOY-370). Fix ability to assign functions with variable assigned functions in controllers.
* [ALOY-376](http://jira.appcelerator.org/browse/ALOY-376). Improve handling of Ti.Android.Menu component.
* [ALOY-393](http://jira.appcelerator.org/browse/ALOY-393). (Re-)enable optimizer.js as part of runtime JavaScript file optimization.
* [ALOY-403](http://jira.appcelerator.org/browse/ALOY-403). Improve Alloy.Collection and Alloy.Model code optimization.
* [ALOY-417](http://jira.appcelerator.org/browse/ALOY-417). Improve properties adapter.

### Deprecations
* [ALOY-401](http://jira.appcelerator.org/browse/ALOY-401). Deprecate Alloy.globals; use Alloy.Globals instead.

## 0.3.2 (15 November 2012)

### Bug fixes and improvements
* [ALOY-353](http://jira.appcelerator.org/browse/ALOY-353). Support all Backbone eventing in Titanium proxies, on(), off(), trigger(). Fixed multiple event firing bug with on().
* [ALOY-355](http://jira.appcelerator.org/browse/ALOY-355). Improve path handling in compiler plugin for OS X.
* [ALOY-356](http://jira.appcelerator.org/browse/ALOY-356). Remove string builtin dependency to shorten compilation time.
* [ALOY-365](http://jira.appcelerator.org/browse/ALOY-365). Add Alloy.globals namespace for global context.
* [ALOY-380](http://jira.appcelerator.org/browse/ALOY-380). Create app/alloy.js file automatically for all new projects.

## 0.3.1 (2 November 2012)

### New features
* [ALOY-192](http://jira.appcelerator.org/browse/ALOY-192). Add to-do sample application. Code is available on [github](https://github.com/appcelerator/alloy/tree/master/test/apps/models/todo).
* [ALOY-337](http://jira.appcelerator.org/browse/ALOY-337). Support themes to change the appearance of the entire GUI by customizing styles and assets. For more information, see:
    * [Alloy Styles and Themes](http://docs.appcelerator.com/titanium/3.0/#!/guide/Alloy_Styles_and_Themes)
    * [Themes sample application on github](https://github.com/appcelerator/alloy/tree/master/test/apps/advanced/themes)

### Bug fixes and improvements
* [ALOY-306](http://jira.appcelerator.org/browse/ALOY-306). Support platform, formFactor, and inline event attributes with abstract types in markup.
* [ALOY-340](http://jira.appcelerator.org/browse/ALOY-340). Fix Android "too deep recursion while parsing" error with Rhino runtime.
* [ALOY-341](http://jira.appcelerator.org/browse/ALOY-341). Improve adapter-backbone processing.
* [ALOY-352](http://jira.appcelerator.org/browse/ALOY-352). Fix SQL adapter to work if no migrations are present.
* [ALOY-354](http://jira.appcelerator.org/browse/ALOY-354). Fix "alloy generate jmk" command.

0.3.0 (beta)
------------
* Removed node-appc dependency.
* Added Alloy splash screens and icons
* Updated widgets, added new button-grid widget.
 
0.2.42
--------
* Ti.UI.OptionDialog markup parser added. Check out this link for a test app and usage: [https://github.com/appcelerator/alloy/tree/master/test/apps/ui/optiondialog](https://github.com/appcelerator/alloy/tree/master/test/apps/ui/optiondialog)
* You can get the Alloy version at runtime now with `Alloy.version`
* Tightened up XML ID restrictions. As an enforced best practice, no reserved JS words as IDs. If you try to, you'll get a compile time error message.
* Revamp of code processing, better organized, more efficient. It's all under the hood, you shouldn't notice, other than compiles might be faster.
* Quick fix to error output in compiler plugin.py
* Some minor cleanup in the test apps
