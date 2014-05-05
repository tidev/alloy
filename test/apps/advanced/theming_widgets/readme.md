# Theming widgets

You can apply theme-settings to widgets in your project. Your theme settings override default styles and assets defined within the widget. 

## Details

* Within your theme folder, create a folder named `widgets`
* With that folder, create a folder with a name that matches the widget ID, such as `com.somecompany.widgetname`
* Within that folder, create `assets` and `styles` folders whose contents override the styles of the widget. Follow typical theming procedures to specify new styles and assets.

**Note:** Platform-specific assets and style selectors in the widget override non-platform-specific assets and styles in your theme.