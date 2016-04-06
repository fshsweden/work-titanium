/*
 *
 *
 *
 *
 */

Ti.API.info("page4 loaded");

var page_tab;
var page2 = require('ui/common/page2');
var page3 = require('ui/common/page3');
var teams;

var setTab = function(t) {
	page_tab = t;
}

var win;
var view;

var init = function() {

	win = Ti.UI.createWindow({
//		backgroundColor : "white",
		title : "Inställningar"
	});

	win.rightNavButton = Ti.UI.createImageView({
		image : 'vhc-logo-no-bg.png',
		width : '80',
		height : 'auto'
	});

	view = Ti.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		top : 0,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : true,
		backgroundColor	: 'transparent',
		backgroundImage: '/images/background.png'
	});
	
	win.add(view);

	/*
	 * STARTUP EVENTS
	 * app.init and app.start are available
	 */
	Ti.App.addEventListener("app.init", function(e) {
		
	})
	
	Ti.App.addEventListener("app.start", function(e) {
		Ti.App.addEventListener("cache.update.finished", function(status) {
			// alert("PAGE4: " + status.status);
			Ti.App.fireEvent("app:setmyteam");
			
			// RE-READ properties to find out selected team(s)
		});
	})
}

/*
 * 
 *
 *
 */
var createTeamCheckboxes = function() {

	teams = ['U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'B-JUN', 'B-JUN:2', 'A-JUN', 'A'];

	var header = Ti.UI.createLabel({
		top : 10,
		left : 30,
		height : 30,
		width : Ti.UI.SIZE,
		text : 'Välj de lag som skall visas:',
		backgroundColor : 'transparent',
		color : 'white'
	});
	view.add(header);

	for (var index = 0; index < teams.length; index++) {
		
		var label = Ti.UI.createLabel({
			top : index * 40 + 50,
			left : 30,
			height : 30,
			width : 100,
			text : teams[index],
			backgroundColor : 'transparent',
			color : 'white'
		});

		// Get State
		var on = Ti.App.Properties.getBool(teams[index], /* default */false);

		var swtch = Ti.UI.createSwitch({
			top : index * 40 + 50,
			left : 120,
			value : on,
			title : teams[index], /* custom prop */
			first_event : true
		});
		view.add(label);
		view.add(swtch);

		swtch.addEventListener('change', function(e) {
			
			Ti.App.Properties.setBool(e.source.title, e.value);
			
			if (e.source.first_event) {
				e.source.first_event = false;
			} else {
				
			}
			Ti.App.fireEvent('data.refresh');
		});
	}
	
	
	var matches_only_label = Ti.UI.createLabel({
		top : index * 40 + 50,
		left : 30,
		height : 30,
		width : Ti.UI.SIZE,
		text : "Visa endast matcher",
		backgroundColor : 'transparent',
		color : 'white'
	});
	view.add(matches_only_label);
	
	var onlymatches = Ti.App.Properties.getBool("onlymatches", /* default */false);
	
	var matches_only_swtch = Ti.UI.createSwitch({
		top : index * 40 + 50,
		left : 200,
		width : Ti.UI.SIZE,
		value : onlymatches,
		title : 'matcher',
		first_event : true
	});
	view.add(matches_only_swtch);
	matches_only_swtch.addEventListener('change', function(e) {
		Ti.App.Properties.setBool("onlymatches", e.value);
		Ti.App.fireEvent('data.refresh');
	});
	
};

var createSettingsWin = function() {
	createTeamCheckboxes();
	return win;
};

exports.init = init;
exports.setTab = setTab;
exports.createTeamCheckboxes = createTeamCheckboxes;
exports.createSettingsWin = createSettingsWin;
