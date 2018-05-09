/**
 * This file is for animating the menu in and out, including black background
 * Edit where you see fit. The actual content is not in this controller though
 */

var drawerWidth = $.args.drawerWidth;
var drawerAnimationDuration = $.args.animationDuration;

if ($.args.navigation) {
  $.navigationContainer.add($.args.navigation);
}

$.navigationContainer.width = drawerWidth;
$.navigationContainer.left = -drawerWidth;

exports.open = function() {

  $.getView().open();

  $.blackScreen.animate(Ti.UI.createAnimation({
    opacity : 0.6,
    duration : drawerAnimationDuration
  }));

  $.navigationContainer.animate(Ti.UI.createAnimation({
    left : 0,
    duration : drawerAnimationDuration
  }));
};

function closeDrawer() {
  exports.close();
}

exports.close = function() {
  $.blackScreen.animate(Ti.UI.createAnimation({
    opacity : 0,
    duration : drawerAnimationDuration
  }), function() {
    $.blackScreen.zIndex = 0;

    // small timeout for UX purposes
    setTimeout(function() {
      $.getView().close();
    }, 150);
  });

  $.navigationContainer.animate(Ti.UI.createAnimation({
    left : -drawerWidth,
    duration : drawerAnimationDuration
  }));
};
