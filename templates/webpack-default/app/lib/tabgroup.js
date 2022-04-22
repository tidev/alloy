module.exports = {
	set tabgroup(tg) {
		this.tg = tg;
	},
	get tabgroup() {
		return this.tg;
	},
	openWindow(window) {
		this.tg.activeTab.open(window);
	}
};
