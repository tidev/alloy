
module.exports = function($, opts) {
	opts = opts || {};

	var styler = {};
	if (OS_ANDROID) {
		styler = {
			mainView: {
				backgroundImage: '/bg_blue.png',
				borderColor: '#383838'
			},
			progressBack: {
				backgroundColor: '#ddd'
			},
			progressFront: {
				backgroundImage: '/title_gray.png'
			},
			button: {
				backgroundImage: '/button_dark.png',
				color: '#fff'
			}
		};
	} else if (OS_IOS) {
		styler = {
			cover: {
				backgroundColor: '#050'
			},
			mainView: {
				backgroundImage: '/bg_tan.png',
				borderColor: '#3da22f'
			},
			patienceLabel: {
				color: '#000'
			},
			progressBack: {
				backgroundColor: '#333',
				borderRadius: 16
			},
			progressFront: {
				backgroundImage: '/title_green.png',
				borderRadius: 16
			},
			button: {
				backgroundImage: '/button_green.png'
			}
		};
	} else if (OS_MOBILEWEB) {
		styler = {
			mainView: {
				backgroundImage: '/bg_gray.png',
				borderColor: '#1e99fd'
			},
			progressBack: {
				backgroundColor: '#333'
			},
			progressFront: {
				backgroundImage: '/title_blue.png'
			},
			button: {
				backgroundImage: '/button_blue.png',
				color: '#fff'
			}
		};
	}

	$.__styler = styler;
};
