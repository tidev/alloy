var Alloy = require("alloy");

var $master1 = Ti.UI.createView({
	id: "master"
});

var $detail1 = Ti.UI.createView({	
	id: "detail"
});

var $search1 = Ti.UI.createSearchBar({
	top:0,
	height: 50,
	barColor:"#000",
	showCancel:true,
	id: "search"
});

var $table1 = Ti.UI.createTableView({
	top: 51,
	height: Ti.UI.FILL,
	id:"table"
});

var $image1 = Ti.UI.createImageView({
	id: "#image"
});

var $w = Ti.UI.iPad..createSplitWindow({
	masterView: $master1,
	detailView: $detail1,
	id:"#window"
});

$master1.add($search1);
$master1.add($table1);
$detail1.add($image1);


// execute the controller inside a function block allowing us to 
// pass in the right scoped variable names for the controller by passing
// in the mangled names thare a local to the function block
(function(window, master, detail, search, table, image){

	table.setData([
		{"title":"Alcatraz", "image":"smallpic1.jpg"},
		{"title":"American Flag", "image":"smallpic2.jpg"},
		{"title":"Row 3", "Penitentiary Sign":"smallpic3.jpg"}
	]);

	table.addEventListener("click",function(e)
	{
		image.image = e.rowData.image;
	});

	search.addEventListener("change", function(e)
	{
	});
	
	// notice we would compile out the OS_IPAD if statement using uglify.js since we are on an iPad generated code
	Ti.API.info("We are on an iPad so you should see a split view");
	
})($w, $master1, $detail1, $search1, $table1, $image1);


$w.open();