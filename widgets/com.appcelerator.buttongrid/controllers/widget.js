 /**
 * @class com.appcelerator.buttongrid, see the documentation in the docs folder for more details.
 */

var TEXTSIZE = 10;

var defaults = {
    buttonWidth: 50,
    buttonHeight: 75,
    textSize: TEXTSIZE + 'dp',  // Font size of the label for the button.
    textColor: 'white',         // Text color of the label.
    textSelectedColor: 'black'  // Text color of the label when the button is selected.
};

exports.init = function ButtonGridInit(args) {
    $._buttons = args.buttons;
    $._params = _.defaults(args, defaults);
    
    _.each($._buttons, function (button, index) {
        Ti.API.info('Buttongrid: creating button ' + button.id);
           
        var buttonProps = {
            center: { x: "50%", y: "50%" },    
            id: button.id,
            backgroundImage: '/images/' + button.id + '.png',
            backgroundColor: button.backgroundColor || $._params.backgroundColor || 'transparent',
            backgroundSelectedColor: button.backgroundSelectedColor || $._params.backgroundSelectedColor || 'transparent',
            width: $._params.buttonWidth,
            height: $._params.buttonHeight
        };
            
        if (OS_ANDROID || OS_MOBILEWEB) {
            if (button.title) {
                // On Android we can add a label to a button and align it to the bottom. The vertical align doesn't work on iOS.
                buttonProps.title = button.title;
                buttonProps.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
                buttonProps.verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM;
                buttonProps.font = { fontSize: $._params.textSize };
                buttonProps.color = $._params.textColor;
                buttonProps.selectedColor = $._params.textSelectedColor;
            }
        }
            
        // Create and add the button to the scroll view.
        $._buttons[index].b = Ti.UI.createButton(buttonProps);
        if (button.click) {
            $._buttons[index].b.addEventListener('click', button.click);
        }
        $.scrollview.add($._buttons[index].b);
            
        if (OS_IOS && button.title) {
            // On iOS we need to place the text label into the button view proper. 
            var theLabel = Ti.UI.createLabel({
                color: $._params.textColor,
                backgroundColor: 'transparent',
                width: $._params.buttonWidth,
                height: Ti.UI.SIZE,
                bottom: (TEXTSIZE / ((button.title.split("\n").length - 1) ? 2 : 1)) + 'dp',
                font: { fontSize: $._params.textSize },
                text: button.title,
                textAlign: 'center',
                touchEnabled: false
            });
            $._buttons[index].b.add(theLabel);                  
        }
    });
    
    Ti.Gesture.addEventListener("orientationchange", $.relayout);
    $.relayout();
};
    
exports.relayout = function ButtonGridRelayout(e) {
    Ti.API.info("ButtonGrid: relayout");
    var duration = $._params.duration || 2000;
    
    // Modify the width of the overall scroll view to reflect the rotation.
    $.scrollview.contentWidth = Ti.Platform.displayCaps.getPlatformWidth();
    $.scrollview.contentHeight = 'auto';

    // Calculate the new gutter.
    var w = Ti.Platform.displayCaps.getPlatformWidth();
    var n = Math.floor(w / $._params.buttonWidth);
    var gutter = (w - n * $._params.buttonWidth) / (n + 1);
    var left = gutter, top = gutter;

    // Animate the buttons into place.
    _.each($._buttons, function (button) {
        button.b.animate({
            left: left,
            top: top,
            duration: duration
        });
        left += gutter + $._params.buttonWidth;
        if (left >= w) {
            left = gutter;
            top += gutter + $._params.buttonHeight;
        }
    });
};