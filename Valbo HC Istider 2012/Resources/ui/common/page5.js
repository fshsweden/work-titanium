/*
 *
 *
 *
 *
 */
Ti.API.info("page5 loaded");

Ti.include("/ui/common/xdate.js");

var page_tab;

exports.setTab = function(t) {
	page_tab = t;
}

exports.init = function() {
	/*
	 * STARTUP EVENTS
	 * app.init and app.start are available
	 */
	Ti.App.addEventListener("app.start", function(status) {
		
		Ti.App.addEventListener("cache.update.finished", function() {
			// alert("PAGE5: " + status.status);
		});
	})
}

exports.hello = function() {
	Ti.API.info("Hello from Page5");
}

exports.createWin = function() {
	
	var win = Ti.UI.createWindow({
		backgroundColor : "white",
		title : "Om VHC Istider",
		layout: 'vertical'	
	});

	win.rightNavButton = Ti.UI.createImageView({
		image : 'vhc-logo-no-bg.png',
		width : '80',
		height : 'auto'
	});

	var version = Ti.UI.createLabel({
		left : 15,
		height : 'auto',
		borderColor : 'transparent',
		text : 'Version: ' + Ti.App.version
	});

	/*
	 * ONLINE
	 */	
	var bgcolor;
	var network_state;
	if (Ti.Network.online) {
		bgcolor = 'white';
		network_state = "Online";
	}
	else {
		bgcolor = 'red';
		network_state = "Offline";
	}
	
	var online = Ti.UI.createLabel({
		left : 15,
		height : 'auto',
		borderColor : 'transparent',
		backgroundColor: bgcolor,
		text : 'Network: ' + network_state
	});
	
	Ti.Network.addEventListener('change', function(evt) {
		if (evt.online) {
			online.text = "Nätverk: Online";
			online.backgroundColor = 'white';
		}	
		else {
			online.text = "Nätverk: Offline";
			online.backgroundColor = 'red';
		}
	});

	/*
	 *	DB-UPDATE DATE/TIME		
	 */
	var db_time_str = "Uppdatering okänd";
	var db_time_label = Ti.UI.createLabel({
		left : 15,
		height : 'auto',
		borderColor : 'transparent',
		text : 'Databas:' + db_time_str
	});
	
	function updateDbTime() {
		var db_time = Titanium.App.Properties.getInt('lastUpdatedTS_v2');
		if (db_time != 0) {
			var xd = new XDate(db_time * 1000);
			db_time_str = xd.toString("yyyy-MM-dd HH:mm:ss")
		}
		db_time_label.text = "Databas:" + db_time_str;
	}
	
	updateDbTime();
	Ti.API.addEventListener("update.db.time", function() {
		updateDbTime();
	});
	
	/*
	 * SOFTWARE BY
	 */
	var by = Ti.UI.createLabel({
		left : 15,
		height : 'auto',
		borderColor : 'transparent',
		font : {
			fontFamily : 'Arial',
			fontStyle : 'italic',
			fontWeight : 'bold'
		},
		text : 'software by:',
		color : 'gray'
	});
	
	var img = Ti.UI.createImageView({
		top: 50,
		left : 60,
		borderColor : 'transparent',
		image : '/images/andersson-jersey.png',
		width : '400px',
		height : '400px'
	});

	
	win.add(version);
	win.add(online);
	win.add(db_time_label);
	win.add(by);
	win.add(img);

	return win;
};

