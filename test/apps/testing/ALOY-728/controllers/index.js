$.index.open();

// These should be found
var bar = Ti.Locale.getString('foo');
var bar1 = Titanium.Locale.getString('foo1good');
var another = L("found_me");

// It won't, and shouldn't, find these. Only explicit strings will be captured.
var foo = 'tooooooo';
var bar2 = Titanium.Locale.getString(foo);
var bar3 = L("hi" + foo + "there");

// It also shouldn't find these as they have invalid characters. Only alphanumberic and
// underscores are supported. It must also start with a letter.
L('OMG****');
L('foo%ipod');
Ti.Locale.getString('123badvalue');