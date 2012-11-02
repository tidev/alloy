function IndexOpen(e) {
    $.logo.init({ image: '/images/alloy.png', width: 216, height: 200 });
}

// Initialize the drawer with our buttons
$.drawer.init({
    mainWindow: $.index,
    buttons: [
        { id: 'One', title: 'One', click: function (e) { alert("One"); }, enabled: function (e) { return false; } },
        { id: 'Two', title: 'Two',  click: function (e) { alert("Two"); } },    
        { id: 'Three', title: 'Three',  click: function (e) { alert("Three"); } }    
    ], 
    autoClose: true,
    gutter: 5,
    overrideMenu: false, // Set to true to see the drawer vs the activity menu
    annoy: true
});
$.drawer.checkEnabled();

$.index.open();
