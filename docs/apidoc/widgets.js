/**
 * @class Alloy.widgets
 * Widgets are self-contained components that can be easily dropped into an Alloy project.
 * They were conceived as a way to reuse code in multiple projects or to be used multiple
 * times in the same project.
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
 * For more information on widgets, see [Alloy Widgets](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Widgets)
 */
