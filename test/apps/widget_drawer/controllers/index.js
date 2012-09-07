function IndexOpen(e) {
    // Bounce in the logo
    setTimeout(function() {
        $.logo.animate({ top:"33%", opacity: 1.0, duration: 500 }, 
            function (e) { 
                $.logo.animate({ top: "25%", duration: 250 }) ;
            }
        );
    }, 1000);
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
    overrideMenu: false // Set to true to see the drawer vs the activity menu
});
$.drawer.checkEnabled();

$.index.open();
