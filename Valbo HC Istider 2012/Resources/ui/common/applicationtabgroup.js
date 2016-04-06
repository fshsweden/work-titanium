/*
 *
 *
 *
 *
 *
 *
 */
var page2 = require('ui/common/page2');
var page3 = require('ui/common/page3');
var page4 = require('ui/common/page4');
var page5 = require('ui/common/page5');

var platformWidth = Ti.Platform.displayCaps.platformWidth;
var platformHeight = Ti.Platform.displayCaps.platformHeight;

exports.init = function() {
	platformWidth = Ti.Platform.displayCaps.platformWidth;
	platformHeight = Ti.Platform.displayCaps.platformHeight;
}
/*	--------------------------------------------------------------------------------
 *
 *	createApplicationTabGroup: create the main application window
 *
 * 	--------------------------------------------------------------------------------
 */
exports.createApplicationTabGroup = function(_args) {

	var tabgroup = Ti.UI.createTabGroup({backgroundColor:'black'});

	/*
	 * Nyheter
	 */
	/*
	 appgroup.page1_win = page1.createWebWin();
	 appgroup.page1_tab = Ti.UI.createTab({
	 title: "Nyheter",
	 window: appgroup.page1_win,
	 icon: 'nyheter.png'
	 });
	 page1.page1_tab = appgroup.page1_tab; // NEW
	 tabgroup.addTab(appgroup.page1_tab);
	 */
	/*
	 * Istider
	 */
	Ti.API.info("Creating page2");
	var page2_win = page2.createIstiderWin();
	var page2_tab = Ti.UI.createTab({
		title : "Istider",
		window : page2_win,
		icon : 'istider.png'
	})
	page2.setTab(page2_tab);
	page2.setWin(page2_win);
	tabgroup.addTab(page2_tab);

/*	var img = Ti.UI.createImageView({
		image : '/beta.png',
		width : platformWidth,
		height : platformHeight
	});
	page2_win.add(img);
	setTimeout(function() {
		img.hide();
	}, 8000);
	img.addEventListener("click", function() {
		this.hide();
	});
*/	
	Ti.API.info("Done creating page2");

	/*
	 * Mina Lag
	 */
	Ti.API.info("Creating page3");
	var page3_win = page3.createMyTeamWin();
	var page3_tab = Ti.UI.createTab({
		title : "Mina lag",
		window : page3_win,
		icon : 'my_team.png'
	})
	page3.setTab(page3_tab);
	page3.setWin(page3_win);
	tabgroup.addTab(page3_tab);
	Ti.API.info("Done creating page3");

	/*
	 * Inställningar
	 */
	Ti.API.info("Creating page4");
	var page4_win = page4.createSettingsWin()
	var page4_tab = Ti.UI.createTab({
		title : "Inställningar",
		window : page4_win,
		icon : 'settings.png'
	})
	page4.setTab(page4_tab);
	tabgroup.addTab(page4_tab);
	Ti.API.info("Done creating page4");

	/*
	 * Om
	 */
	Ti.API.info("Creating page5");
	var page5_win = page5.createWin();
	var page5_tab = Ti.UI.createTab({
		title : "Om",
		window : page5_win,
		icon : 'about.png'
	})
	page5.setTab(page5_tab);
	tabgroup.addTab(page5_tab);
	Ti.API.info("Done creating page5");

	return tabgroup;
};

