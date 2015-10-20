/**
 * @class Alloy.Widget
 * Widgets are self-contained components that can be easily dropped into an Alloy project.
 * They were conceived as a way to reuse code in multiple projects or to be used multiple
 * times in the same project.
 *
 * Note that to use the methods list below, the correct namespace is `Widget.create*` not
 * `Alloy.Widget.create*`.
 *
 * For more information on widgets, see [Alloy Widgets](http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Widgets).
 *
 * #### Creating a Widget
 *
 * Widgets are essentially miniature Alloy projects that contain their own models, views, controllers
 * and assets.  They are laid out the same way as an Alloy project.
 *
 * Use `Widget.createController()`, `Widget.createWidget()`,  `Widget.createModel()` and
 * `Widget.createCollection()` rather than the `Alloy.create*` methods to create
 * components relative to the widget context rather than the Alloy project.
 *
 * #### Using a Widget
 *
 * To import a widget in to a project:
 *
 *  1. Copy the widget to the `app/widgets` folder.  The widget must be contained within its own folder.
 *  2. Update the `dependencies` object in the `config.json` file by adding a key/value pair with the name of
 *     the widget as the key and the version number as the value.
 *  3. Add the widget to a view or create an instance of the widget in a controller:
 *
 *      * To add a widget to a view, add the <Widget> tag in the XML markup and
 *        set the `src` attribute to the folder name of the widget.
 *      * To create an instance of a widget in a controller, use the Alloy.createController method.
 *
 * You can optionally add the `id` and `name` attributes to the `Widget` element:
 *
 *  * The `id` attribute allows you to reference the widget in the controller code.  You can use this
 *    reference to call methods exported by the widget.
 *  * The `name` attribute allows you to import a specific view-controller in the widget rather than the
 *    default one (`widget.xml`/`widget.js`).  Specify the name of the view-controller minus the extension.
 *
 * For example, to import a widget called `mywidget` in to a project, copy `mywidget` to the
 * `app/widgets` folder, where its assets, controllers, views, etc. are contained in the
 * `app/widgets/mywidget` folder.
 *
 *     app
 *     ├── config.json
 *     ├── controllers
 *     │   └── index.js
 *     ├── views
 *     │   └── index.xml
 *     └── widgets
 *         └── mywidget
 *             ├── controllers
 *             │   ├── foo.js
 *             │   └── widget.js
 *             ├── views
 *             │   ├── foo.xml
 *             │   └── widget.xml
 *             └── widget.json
 *
 * Next, add it as a dependency in your `config.json` file:
 *
 *     ...
 *     "dependencies":{
 *         "mywidget":"1.0"
 *     }
 *
 *
 * Finally, either add the widget in the XML markup of the view or create an instance of the widget in the controller.
 *
 * To add the widget in the view, use the `Widget` tag, specifying the `src` attribute as the name of
 * the widget:
 *
 *     <Alloy>
 *         <Window id="win">
 *             <Widget id="myWidget" src="mywidget" />
 *         </Window>
 *     </Alloy>
 *
 * Since the `id` attribute is defined, the widget can be referenced in the controller using
 * `$.myWidget`.
 *
 * To add the widget in the controller, use the `Alloy.createWidget` method. The first required parameter is
 * the name of the widget. The second optional parameter can specify the view component to
 * instantiate and the last optional parameter can specify the arguments to instantiate the widget.
 * For example, the following controller code is equivalent to the previous view markup example.
 *
 *     var myWidget = Alloy.createWidget("mywidget");
 *     win.add(myWidget.getView());
 *
 * A widget can also be added to other widgets.  Follow the same procedure as above except the widget
 * configuration file is called `widget.json` instead of `config.json`.
 *
 */

/**
 * @method createCollection
 * @inheritdoc Alloy#createCollection
 * @since 1.1.0
 */

/**
 * @method createController
 * @inheritdoc Alloy#createController
 * @since 1.1.0
 */

/**
 * @method createModel
 * @inheritdoc Alloy#createModel
 * @since 1.1.0
 */

/**
 * @method createWidget
 * @inheritdoc Alloy#createWidget
 * @since 1.1.0
 */

/**
 * @class Alloy.widgets
 * The sample widgets are no longer supplied or supported and have been removed from Alloy.
 *
 * Maintained versions of the sample widgets are available at [http://gitt.io/](http://gitt.io/).
 *
 * For information on using a widget in your project, see
 * Alloy.Widget.
 */
