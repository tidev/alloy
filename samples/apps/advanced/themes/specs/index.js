module.exports = function($) {

	var styler = {};
	if (OS_ANDROID) {
		styler = {
			index: {
				backgroundImage: '/bg_blue.png'
			},
			title: {
				color: '#fff',
				backgroundImage: '/title_gray.png'
			},
			container: {
				backgroundGradient: {
					type: 'linear',
					startPoint: {
						x: '0%',
						y: '0%'
					},
					endPoint: {
						x: '0%',
						y: '100%'
					},
					colors: [ '#5d5d5d', '#2c2c2c' ]
				}
			},
			label: {
				color: '#fff',
				top: 0
			},
			slider: {
				leftTrackImage: '/title_gray.png',
				bottom: 100,
				width: 250
			},
			testButton: {
				backgroundImage: '/button_dark.png',
				color: '#fff'
			}
		};
	} else if (OS_IOS) {
		styler = {
			index: {
				backgroundImage: '/bg_tan.png'
			},
			title: {
				color: '#000',
				backgroundImage: '/title_green.png'
			},
			// TODO: Titanium does not properly return back the
			//       backgroundGradient on iOS. (TIMOB-13915)
			container: {
				right: 10
			},
			slider: {
				leftTrackImage: '/title_green.png',
				top: 228,
				left: -145,
				width: 350,
				transform: Alloy.CFG.sliderTransform
			},
			testButton: {
				backgroundImage: '/button_green.png',
				right: 15
			}
		};
	} else if (OS_MOBILEWEB) {
		styler = {
			index: {
				backgroundImage: '/bg_gray.png'
			},
			title: {
				color: '#fff',
				backgroundImage: '/title_blue.png',
				font: {
					fontSize: '24px',
					fontWeight: 'bold'
				}
			},
			container: {
				backgroundGradient: {
					type: 'linear',
					startPoint: {
						x: '0%',
						y: '0%'
					},
					endPoint: {
						x: '0%',
						y: '100%'
					},
					colors: [ '#39abfb', '#0285ff' ]
				}
			},
			label: {
				color: '#fff',
				font: {
					fontSize: '140px',
					fontWeight: 'bold'
				}
			},
			slider: {
				leftTrackImage: '/title_blue.png',
				bottom: 100,
				width: 250
			},
			testButton: {
				color: '#fff',
				backgroundImage: '/button_blue.png'
			}
		};
	}

	// add the styer as a hidden argument to the controller to
	// DRY out the unit testing code.
	$.__styler = styler;
};
