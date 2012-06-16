WIDGET EXAMPLE
==============

In this example, we are going to define a custom widget and import that into our application.

The widget is defined in a separate 'widgets' subdirectory, but we would also support a widget distribution packaging much like modules today so that you could simply reference them and then they would automatically be found and imported either by searching for local widgets in the folder of the app or by scanning the titanium distribution, etc.

The widget would define its own views and controllers and they would work very similar to any normal application.

The widget controller would be able to export zero or more properties or methods that define the public interface for the widget.

The widget view styles can also be imported by the views JSON file by using a special widget ID pattern: <#widget_id #id>.

For example, if the widget was imported to the name 'w' and the internal ID of a control was 'b' - the reference would be '#w:#b'.

