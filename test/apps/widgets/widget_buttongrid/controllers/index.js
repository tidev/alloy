var animation = require('alloy/animation');

function IndexOpen(e) {
    $.logo.init({ image: '/images/alloy.png', width: 216, height: 200, opacity: 0.1 });
    $.buttongrid.relayout(e);    
}

var red = '#900A05';
var brightred = '#B00C07';
var black = '#000000';
var gray = '#888888';

$.buttongrid.init({
    buttons: [
        { id: 'Cloudy', title: 'Cloudy', backgroundColor: black, backgroundSelectedColor: gray },
        { id: 'Drizzle', title: 'Drizzle' },
        { id: 'Haze', title: 'Haze' },
        { id: 'MostlyCloudy', title: 'Mostly Cloudy' },
        { id: 'SlightDrizzle', title: 'Slight Drizzle' },
        { id: 'Snow', title: 'Snow' },
        { id: 'Sunny', title: 'Sunny' },
        { id: 'Thunderstorms', title: 'Thunderstorms', click: function (e) { alert('Thunder!'); } }
    ],
    buttonWidth: Alloy.isTablet ? 200: 100,
    buttonHeight: Alloy.isTablet ? 200 : 100,
    backgroundColor: red,
    backgroundSelectedColor: brightred,
    duration: 1000
});

$.buttongrid.getButton('Drizzle').backgroundColor = "gray"; 

$.index.open();
