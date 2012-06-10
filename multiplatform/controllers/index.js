

table.setData([
	{"title":"Row 1", "image":"smallpic1.jpg"},
	{"title":"Row 2", "image":"smallpic2.jpg"},
	{"title":"Row 3", "image":"smallpic3.jpg"}
]);


table.addEventListener("click",function(e)
{
	// note that the JPG images will be loaded (as compiled) from the assets directory
	image.url = e.rowData.image;
});

search.addEventListener("change", function(e)
{
	// do something with e.value
});


if (OS_IPAD)
{
	// this code would be executed in the ipad example
	
	Ti.API.info("We are on an iPad so you should see a split view");
}