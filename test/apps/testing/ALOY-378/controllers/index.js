if (!Ti.App.Properties.hasProperty('aloy378')) {
    var titles = ["Lord of the Rings", "Harry Potter", "Eragon", "Wheel of Time", "Narnia"];
    for(var i=0,j=titles.length;i<j;i++) {
        Alloy.createModel('books', { title: titles[i]}).save();
    }
    Ti.App.Properties.setString('aloy378', 'yes');
}

function doFoo(num){
	alert('Your rating = ' + num);
}
$.starwidget.init(doFoo);


$.index.open();

Alloy.Collections.books.fetch();