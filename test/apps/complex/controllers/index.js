
// top is the first view we defined
$.top.updateLayout({
	backgroundColor:"black",
	borderRadius:2,
	borderColor:"blue",
	height:100
});

$.bottom.b.addEventListener('click',function(){
	$.middle.t.text = "You clicked me";
});

$.index.open();

