# Custom TSS queries

Starting with Alloy 1.4, you can test for boolean values in your your TSS queries. These custom TSS queries are useful for tasks like setting styles when running on a specific phone model (i.e. an iPhone 5).

You must define these values in the alloy.js as properties of the Alloy.Globals object so that they are available to the XML and TSS parsers.

1. In your alloy.js, add a property to the Alloy.Globals object that sets the boolean value you will test `Alloy.Globals.isIOS7 = (OS_IOS && parseInt(Ti.Platform.version, 10) >= 7);`
2. Use the variable in either the XML or TSS:
    * In the XML: `<View id="view" if="Alloy.Globals.isIOS7"/>`
    * In the TSS: `"#view[if=Alloy.Globals.isIOS7]": { ...}`

Test the sample app on various devices: iPhone 4 or 5, iPad, Android phone, Android tablet to see the various style attributes applied based on the custom queries.