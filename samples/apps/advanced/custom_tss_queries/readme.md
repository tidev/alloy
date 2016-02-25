# Custom TSS queries

Starting with Alloy 1.4.0, you can test for boolean values in your your TSS queries. These custom run-time TSS queries are useful for tasks like setting styles when running on a specific phone model (e.g. an iPhone 5).

You must define these values in the alloy.js as properties of the Alloy.Globals object so that they are available to the XML and TSS parsers.

1. In your alloy.js, add a property to the Alloy.Globals object that sets the boolean value you will test for example `Alloy.Globals.isIOS7 = (OS_IOS && parseInt(Ti.Platform.version, 10) >= 7);`
2. Use the variable in either the XML or TSS:
    * In the XML: `<View id="view" if="Alloy.Globals.isIOS7"/>`
    * In the TSS: `"#view[if=Alloy.Globals.isIOS7]": { ...}`

You can test for multiple values by separating them with a comma. Such tests are treated as OR tests: `<View id="view" if="Alloy.Globals.isIOS7,Alloy.Globals.someOtherVar"/>` is treated like `if(Alloy.Globals.isIOS7 || Alloy.Globals.someOtherVar)` To use AND conditions or for more complex logic, process the conditions in alloy.js setting a single Boolean value in the end:

```javascript
// alloy.js
Alloy.Globals.customVar = (
		(OS_IOS && parseInt(Ti.Platform.version, 10) >= 7) || 
		(OS_ANDROID && parseFloat(Ti.Platform.version,10) >= 4.0.3)
	);
```

For this sample app, examine the comments in the index.tss file to see how the styles should be applied. Then, test the app on various simulators and devices. Modify the Alloy.Globals.someProperty variable's value and test again.