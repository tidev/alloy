/**
 * @class Alloy.Widget
 * Widgets are self-contained components that can be easily dropped into an Alloy project.
 * They were conceived as a way to reuse code in multiple projects or to be used multiple
 * times in the same project.
 *
 * Note that to use the methods list below, the correct namespace is `Widget.create*` not
 * `Alloy.Widget.create*`.
 *
 * For more information on widgets, see [Alloy Widgets](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Widgets)
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
 * To use a widget in your Alloy project, first add it as a dependency in your config.json file.
 * The name of the widget is the key and the version of the widget is the value.
 *
 *     ...
 *     "dependencies":{
 *         "com.appcelerator.loading":"1.0"
 *     } 
 *   
 *
 * Next, either add the widget in the XML markup of the view or create an instance of the widget in the controller.
 *
 * To add the widget in the view, use the `Widget` tag, specifying the `src` attribute as the name of
 * the widget:
 *
 *     <Alloy>
 *         <Window id="win">
 *             <Widget id="loadIcon" src="com.appcelerator.loading" />
 *         </Window>
 *     </Alloy>
 *
 * Since the `id` attribute is defined, the widget can be referenced in the controller using
 * `$.loadIcon`.
 *
 * To add the widget in the controller, use the `Alloy.createWidget` method. The first required parameter is
 * the name of the widget. The second optional parameter can specify the view component to
 * instantiate and the last optional parameter can specify the arguments to instantiate the widget.
 * For example, the following controller code is equivalent to the previous view markup example.
 *
 *     var loadIcon = Alloy.createWidget("com.appcelerator.loading");
 *     win.add(loadIcon);
 *
 * A widget can also be added to other widgets.  Follow the same procedure as above except the widget
 * configuration file is called widget.json instead of config.json.
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
 * As of Release 1.4.0, the sample widgets are deprecated and no longer supported.  These widgets
 * will be removed in a future release of Alloy.
 *
 * Maintained versions of the sample widgets are available at [http://gitt.io/](http://gitt.io/).
 *
 * List of sample widgets in the Alloy project. For information on using a widget in your project, see
 * Alloy.Widget.
 */
