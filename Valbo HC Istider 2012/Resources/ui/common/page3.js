var this_tableview;
var win;
var this_view;

var db_module = require('ui/common/db_module');
var istider_data = require('ui/common/istider_data');
var tools = require('ui/common/tools');
var page_tab; // MUST BE SET OR PROBLEMS!!!
var header;

var	isAndroid	= false;
var	isIOS		= false;
var	isSmartPhone	= false; // most often iPhone
var	isTablet		= false; // most often iPad

if (Ti.Platform.osname === 'android') {
	isAndroid = true;	
} else 
if (Ti.Platform.osname === 'iphone') {
	isIOS		= true;
	isSmartPhone= true;	
} else 
if (Ti.Platform.osname === 'ipad') {
	isIOS		= true;
	isTablet		= true;	
} 

var init = function() {

	Ti.App.addEventListener("app.init", function(e) {
		reloadPage3DataFromCache();		
	});
	
	/*
	 * STARTUP EVENTS
	 * app.init and app.start are available
	 */
	Ti.App.addEventListener("app.start", function(e) {
		
		Ti.App.addEventListener("cache.update.finished", function(status) {
			// alert("PAGE3:" + status.status);  // @TODO: FIX
			reloadPage3DataFromCache();
		});
		
		Ti.App.addEventListener("data.refresh", function(e) {
			reloadPage3DataFromCache();
		});
	})
}

var setTab = function(t) {
	page_tab = t;
}

var setWin = function(w) {
	win = w;	
}

/*
 *
 */
var getMyTeamTableView = function() {
	return this_tableview;
}
/*
 *
 */
var createMyTeamWin = function() {

	win = Ti.UI.createWindow({
		backgroundColor : "black",
		title : "U13"
	});

	/*
	 * Setup a View containing a TableView
	 */
	this_view = Ti.UI.createView({
		backgroundColor : 'black',
		layout: 'vertical'
	});

	/* Header */
	var headerLabel = Titanium.UI.createLabel({
		color : '#ffffff',
		text : 'Mitt lag',
		backgroundColor: 'transparent',
		height : 60,
		top : 20,
		font : {
			fontFamily : 'Arial',
			fontSize : 36,
			fontWeight : 'bold'
		},
		textAlign : "center"
	});

	/* Footer */
	var footerLabel = Titanium.UI.createLabel({
		color : '#000',
		text : 'Mitt lag',
		top : 20,
		font : {
			fontFamily : 'Arial',
			fontSize : 36,
			fontWeight : 'bold'
		},
		height : 60,
		textAlign : "center"
	});

	/* The TableView */
	this_tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundImage : '/images/background.png',
		backgroundColor	: 'transparent',
 
		font : {
			fontSize : 12,  // TODO: Make Param
			fontFamily : 'Courier',
			fontWeight : 'normal'
		},
		allowsSelection : true,
		rowHeight : 20, // TODO: Make Param
		separatorStyle : Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
		showVerticalScrollIndicator : true,
		/*			headerView				: headerLabel,
		 footerView				: footerLabel, */
		/* These below have no effect */
		borderRadius : 10.0,
		borderWidth : 3.0,
		borderColor : 'transparent'
	})

	this_tableview.addEventListener("scrollEnd", function() {
		// Scroll the other views too!!
	});

	var onlymatches = Ti.App.Properties.getBool("onlymatches", /* default */false);
	header = Ti.UI.createLabel({
		left		: isSmartPhone ? 20 : 45,
		font : {
			fontSize 	: isSmartPhone ? 15 : 30,
			fontFamily	: 'Arial',
			fontWeight	: 'bold'
		},
		width	: Ti.UI.SIZE,
		text		: onlymatches ? 'Matcher för Mina Lag' : 'Träningar och matcher för Mina Lag',
		backgroundColor : 'transparent',
		color	: 'white'
	});
	this_view.add(header);

	this_view.add(this_tableview);
	win.add(this_view);

	// Create a refresh button!
	var refresh_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});
	refresh_button.addEventListener('click', function() {
		refresh_button.setEnabled(false);
		reloadPage3DataFromCache();
		refresh_button.setEnabled(false);
	});
	win.leftNavButton = refresh_button;
	win.rightNavButton = Ti.UI.createImageView({
		image : 'vhc-logo-no-bg.png',
		width : '80',
		height : 'auto'
	});
	
	/*
	 * Disable the REFRESH button if we dont have network connection!
	 */	
	Ti.API.addEventListener("network.online", function() {
		refresh_button.setEnabled(true);
	});
	
	Ti.API.addEventListener("network.offline", function() {
		refresh_button.setEnabled(false);
	});
	
	return win;
};

/*
 *
 */
var reloadPage3DataFromCache = function() {
	var today_str = tools.getToday();
	//win.title = 'Laddar istider...';
	try {
		Ti.API.info("Refreshing Team Data");
		var teams = db_module.getMyTeams();
		if (teams.length === 0) {
			win.title = "Inget lag valt";
			this_tableview.setData(null);
		} else {
			var onlymatches = Ti.App.Properties.getBool("onlymatches", /* default */false);
			if (onlymatches) {
				header.text = "Matcher för Mina lag";
			}
			else {
				header.text = "Träningar och Matcher för Mina lag";
			}
			var data = db_module.getMyTeamData(onlymatches);
			var rows = istider_data.ConvertJsonToTableViewRowArray(page_tab, today_str, data);
			this_tableview.setData(rows);
			win.title = teams.join('/');
		}
	} catch(exc) {
		win.title = "Inget lag valt"
	}
}

exports.init = init;
exports.setTab = setTab;
exports.setWin = setWin;
exports.getMyTeamTableView = getMyTeamTableView;
exports.createMyTeamWin = createMyTeamWin;
exports.reloadPage3DataFromCache = reloadPage3DataFromCache;

