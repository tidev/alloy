// add the iOS7-specific camera view 
if(OS_IOS && parseInt(Ti.Platform.version, 10)>=7) {
    var cam = Alloy.Globals.Map.createCamera({
        altitude: 300, 
        centerCoordinate: {
            latitude:37.389569, 
            longitude:-122.050212
        }, 
        heading: -45, 
        pitch: 60,
        showsBuildings: true
    });
    var animCam = function(){
        $.map.removeEventListener('complete', animCam);
        $.map.animateCamera({
            camera: cam,
            curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
            duration: 500
        });
    };
    $.map.addEventListener('complete', animCam);
}

$.index.open();