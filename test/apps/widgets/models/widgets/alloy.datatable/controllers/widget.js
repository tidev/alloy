function handleTableClick(e) {
	$.trigger('rowClick', e);
}

Widget.Collections.songs.reset([
	{ info: 'Beastie Boys - Super Disco Breakin\''},
	{ info: 'Pixies - Debaser'},
	{ info: 'N.E.R.D. - Thrasher'},
	{ info: 'Skrillex - Bangarang'},
	{ info: 'Big Gigantic - Hopscotch'},
	{ info: 'Infected Mushroom - Heavyweight'},
	{ info: 'Nine Inch Nails - Into the Void'},
	{ info: 'Ronald Jenkees - Disorganized Fun'},
	{ info: 'Kazu Matsui - Stone Monkey'},
	{ info: 'Apox - Stay Triumphant'},
	{ info: 'Swedish House Mafia - Greyhound'},
	{ info: 'G Love - Milk and Sugar'},
	{ info: 'Elton John - Better Off Dead'},
	{ info: 'Opiuo - King Prawn'}
]);