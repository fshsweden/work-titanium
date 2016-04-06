/*
 * 
 * 
 *
 * 
 *
 * 
 *
 */

var num_weeks = 3; /* ALSO CHANGE NUM_WEEKS_TO_LOAD in db_module.js */
var views = [];
var tableviews = [];

var istider_data = require('ui/common/istider_data');
var db_module = require('ui/common/db_module');
var tools = require('ui/common/tools');
var page_tab;
var win;
var refresh_button;

Ti.include('/ui/common/date_addons.js');

var init = function() {
	views = [];
	tableviews = [];
	
	Ti.App.addEventListener("app.init", function(e) {
		reloadPage2DataFromCache();
	});
	
	/*
	 * STARTUP EVENTS
	 * app.init and app.start are available
	 */
	Ti.App.addEventListener("app.start", function(e) {
		/*
		 * Handler for cache.update.started event
		 */
		Ti.App.addEventListener("cache.update.started", function() {
			Ti.API.info("page2 got cache.update.started notification");
			refresh_button.setEnabled(false);
		});
	
		/*
		 * Handler for cache.update.finished event
		 */
		Ti.App.addEventListener("cache.update.finished", function(status) {
			refresh_button.setEnabled(true);
			Ti.API.info("page2 got cache.update.finished notification : calling reloadPage2DataFromCache");
			reloadPage2DataFromCache();
		});
		
		// Too slow!
		Ti.App.addEventListener("data.refresh", function(status) {
			Ti.API.info("page2 got data.refresh notification : calling reloadPage2DataFromCache");
			reloadPage2DataFromCache();
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
 * This one takes 7 seconds to complete!!!
 */
var reloadPage2ColorsFromCache = function() {
		
}

/*
 * This one takes 7 seconds to complete!!!
 */
var reloadPage2DataFromCache = function() {

	win.title = '';
	Ti.API.info("page2.reloadPage2DataFromCache");

	try {
		Ti.API.info("page2 getting todays date and week#");
		var today = new Date();
		var today_str = tools.getToday();
		
		var start_week = today.getWeek(1);
		
		Ti.API.info("Start week is " + start_week);
		Ti.API.info("Loading from week " + start_week + " to " + (start_week + num_weeks - 1));
		Ti.API.info("Num weeks is " + num_weeks);
		Ti.API.info("End week is " + (start_week + num_weeks));

		for (var myweek = start_week; myweek < (start_week + num_weeks); myweek++) {

			/* get Cached DB data */
			Ti.API.info("Getting cached data for week " + myweek);
			week_data = db_module.getWeekDataFromDatabase(myweek);
			/* Convert it to TableViewRows divided into TableViewSections */
			tblWeekRows = istider_data.ConvertJsonToTableViewRowArray(page_tab, today_str, week_data);

			/* Get the week in question */
			tblview = getTableView(myweek - start_week);

			if (tblWeekRows.length == 0) {
				tblview.hdr.text = "Väntar på data...";
				tblview.ftr.text = "Vecka:" + myweek;
				// tblview.backgroundColor = 'yellow';
			} else {
				if (tblview == undefined) {
					Ti.API.error("TableView with index:" + myweek - start_week + " not found!!!");
				} else {
					tblview.add(Ti.UI.createLabel({
						title : "Vecka:" + myweek,
						top : 20,
						left : 20
					}));
					tblview.setData(tblWeekRows);
					
					/*
					 * Loop thru all weeks and set header to "Week XX"
					 */
					tblview.hdr.text = "Vecka " + tblview.week;
					tblview.ftr.text = "Vecka " + tblview.week;
				}
			}
			win.title = win.title + '*';
		}

	} catch (exc) {
		Ti.API.error(JSON.stringify(exc));
	}

	win.title = 'Istider';
	Ti.API.info("page2.reloadPage2DataFromCache done");
};

/*
 *
 */
var createIstiderWin = function() {
	
	Ti.API.info("page2.createIstiderWin");

	win = Ti.UI.createWindow({
		backgroundColor : "white",
		title : "Istider",
	});

	// refresh this value in case we have been running for many days....
	var today = new Date();
	var start_week = today.getWeek(0);
	var scrollView = createEmptyIstiderScrollView(start_week, num_weeks);
	win.add(scrollView);

	// Create a refresh button!
	refresh_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});
	refresh_button.addEventListener('click', function() {
		Ti.API.info("Firing cache.do.update!");
		// Delete the entries in the database and re-load
		db_module.resetDatabase();
		Ti.App.fireEvent("cache.do.update", {force : true} );
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

var getTableView = function(index) {
	return tableviews[index];
}
/*	--------------------------------------------------------------------
 *	Create 'num_weeks' empty TableViews with 7 days of data in each.
 *
 *	--------------------------------------------------------------------
 */
var createEmptyIstiderScrollView = function(start_week, num_weeks) {

	/*
	 * CREATE A 'num_weeks' WEEK SCROLLVIEW
	 */
	Ti.API.info("setupIstiderScrollView: starting from week:" + start_week);
	/*
	 * Create a view 'v' for every week in this 'num_weeks'-week span
	 * Add a Table View to that View
	 */
	for (var week = start_week; week < (start_week + num_weeks); week++) {

		/*
		 * Setup a View containing a TableView
		 */
		var this_view = Ti.UI.createView({
			backgroundColor : 'black'
		});

		/* Header */
		var headerLabel = Titanium.UI.createLabel({
			color : '#ffffff',
			text : 'Laddar v.' + week,
			height : 60,
			top : 20,
			left : 20,
			font : {
				fontFamily : 'Arial',
				fontSize : 36,
				fontWeight : 'bold'
			},
			textAlign : "center"
		});
		

		/* Footer */
		var footerLabel = Titanium.UI.createLabel({
			color : '#ffffff',
			text : '',
			top : 20,
			left : 20,
			font : {
				fontFamily : 'Arial',
				fontSize : 36,
				fontWeight : 'bold'
			},
			height : 60,
			textAlign : "center"
		});

		/* The TableView */
		var this_tableview = Titanium.UI.createTableView({
			style						: Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundImage				: '/images/background.png', 
			backgroundColor				: 'transparent',
			
			font : {
				fontSize : 10, // TODO: Make param
				fontFamily : 'Courier',
				fontWeight : 'normal'
			},
			allowsSelection				: true,
			rowHeight					: 20,		// TODO: Make Param
			separatorStyle				: Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
			showVerticalScrollIndicator	: true,
			headerView					: headerLabel,
			footerView					: footerLabel
		})

		/* Save ptrs to these labels for later use! */
		this_tableview.hdr = headerLabel;
		this_tableview.ftr = footerLabel;
		this_tableview.week = week;
		
		this_view.add(this_tableview);

		views.push(this_view);
		tableviews.push(this_tableview);
	}

	// Ti.API.info("DEBUG: Views:" + JSON.stringify(views));  // add ,null,4
	// Ti.API.info("DEBUG: TableViews:" + JSON.stringify(tableviews));

	/*
	 * CREATE THE SCROLLER VIEW (Containing 10 Views)
	 *
	 */
	var istiderScrollView = Titanium.UI.createScrollableView({
		views : views,
		pagingControlHeight : 30,
		maxZoomScale : 2.0,
		currentPage : 0,
		showPagingControl : false
	});

	// Ti.API.info("DEBUG: istiderScrollView:" + JSON.stringify(istiderScrollView));

	return istiderScrollView;
}

exports.reloadPage2DataFromCache = reloadPage2DataFromCache;
exports.reloadPage2ColorsFromCache = reloadPage2ColorsFromCache;
exports.createIstiderWin = createIstiderWin;
exports.init = init;
exports.setTab = setTab;
exports.setWin = setWin;
exports.getTableView = getTableView;
exports.createEmptyIstiderScrollView = createEmptyIstiderScrollView;
