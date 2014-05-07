# Custom TSS queries

Starting with Alloy 1.4, you can test for boolean values in your your TSS queries. These custom TSS queries are useful for tasks like setting styles when running on a specific phone model (i.e. an iPhone 5).

You must define these values in the alloy.js as properties of the Alloy.Globals object so that they are available to the XML and TSS parsers.

1. In your alloy.js, add a property to the Alloy.Globals object that sets the boolean value you will test for example `Alloy.Globals.isIOS7 = (OS_IOS && parseInt(Ti.Platform.version, 10) >= 7);`
2. Use the variable in either the XML or TSS:
    * In the XML: `<View id="view" if="Alloy.Globals.isIOS7"/>`
    * In the TSS: `"#view[if=Alloy.Globals.isIOS7]": { ...}`

For this sample app, examine the comments in the index.tss file to see how the styles should be applied. Then, test the app on various simulators and devices. Modify the Alloy.Globals.someProperty variable's value and test again.