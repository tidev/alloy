Ti.include('/runtimeTester.js');

module.exports = function($, opts) {
	opts || (opts = {});
	var color = OS_IOS && Alloy.isHandheld ? '#a00' : '#222';

	addMatchers();

	describe('index controller', function() {
		validateUiComponent($, 'index', {
			api: 'Ti.UI.Window',
			style: {
				backgroundColor: "#eee",
		        fullscreen: false,
		        exitOnClose: true,
		        layout: "vertical",
		        id: "index"
			}
		});

		validateUiComponent($, 'label', {
			api: 'Ti.UI.Label',
			style: {
				color: color,
	            font: {
	                fontSize: OS_MOBILEWEB ? "28px" : "28dp",
	                fontWeight: "bold"
	            },
	            textAlign: "center",
	            height: Ti.UI.SIZE,
	            width: Ti.UI.SIZE,
	            top: "15dp",
	            text: "static label",
            	id: "label"
			}
		});		

		_.each(opts.labels, function(label, i) {
			var id = 'label' + (i+1);
			var newColor = i === 1 ? '#fff' : '#222';
			var backgroundColor = i == 2 ? '#000' : "#00f";
			var font = (function() {
				if (i === 0) {
					return {
						fontSize: OS_MOBILEWEB ? '14px' : 14,
						fontWeight: 'normal'
					};
				} else if (i === 3) {
					return {
						fontSize: OS_MOBILEWEB ? '48px' : '48dp',
						fontWeight: 'normal'
					};
				} else {
					return {
			        	fontSize: OS_MOBILEWEB ? "28px" : "28dp",
			         	fontWeight: "bold"
			        };
				}
			})();

			it('generates style for #' + id + ' as expected', function() {
				expect(label).toHaveStyle({
					color: newColor,
			        font: font,
			        textAlign: "left",
			        height: Ti.UI.SIZE,
			        width: Ti.UI.SIZE,
			        top: "15dp",
			        backgroundColor: backgroundColor,
			        shadowOffset: {
			        	x: 2,
			          	y: 2
			        },
			        shadowColor: "#0f0",
			        id: id,
			        text: "I'm ugly, but styled dynamically!"
				});
			});
		});
	});

	launchTests();
};