var TEXT = 'Click me to add more items';
var info = Alloy.Collections.info;
var ctr = 0;

// Add new ListItems when ever the button is clicked
function doClick(e) {
	if (e.sectionIndex === 0 && e.itemIndex === 0) {
		info.add({
			title: ctr++ === 0 ? TEXT : 'Row #' + ctr
		});
	}
}

// Create a basic section 
$.section.items = [{ properties: { title: TEXT } }];

// Animation options for ListView are only supported on iOS...
if (OS_IOS) {
	// Add "opts" to the "dataFunction" function object. In this case, we'll be
	// adding "animation" options that will be used by the ListView's generated
	// data binding code to make sure our ListItems don't animate when 
	// updated.
	// TODO: There's a Titanium bug where ListItems still animate when using
	//       the ListSection.setItems() function. When TIMOB-13737 is resolved,
	//       this will work as expected and the ListItems won't animate when
	//       they are added.
	loadData.opts = {
		animation: {
			animated: false
		}
	};
}

// Open the window
$.index.open();



