/*
 * This module is supposed to be REQUIREDm i.e.
 *
 * var db = require('ui/common/db')
 *
 *	checkDatabase() will check with checkNeedsUpdating(), which will check the lastUpdatedTS_v2 property.
 * 	If enought time has passed, updateDatabase() will be called. 
 *
 *
 */
Ti.API.info("db_module loaded");

var NUM_WEEKS_TO_LOAD = 3; /* also change num_weeks in page2.js */

var tools = require('ui/common/tools');
var my_db;
var lastUpdatedTS_v2 = 0;

Ti.include('/ui/common/date_addons.js');

/*	--------------------------------------------------------------------------------------------
 *	Important to only call init once! 
 * 	--------------------------------------------------------------------------------------------
 */
var init = function() {
	
	// var sqlite = Ti.Database.install('/istider.sqlite', 'vhc_istider_local_db');
	my_db = Titanium.Database.open('vhc_istider_local_db_v2');
	
	/* New 2012-11-27 Always drop database and do a complete restart (only three days!) */
	var result = my_db.execute("DROP TABLE IF EXISTS istider");
	var lastUpdatedTS_v2 = 0;
	Titanium.App.Properties.setInt('lastUpdatedTS_v2',0);
		
	var result = my_db.execute(
		"CREATE TABLE IF NOT EXISTS istider (" +
		"  'VERSION'  VARCHAR NOT NULL, " + 
		"  'TBLDATE'  VARCHAR NOT NULL, " + 
		"  'Datum'    VARCHAR NOT NULL ," + 
		"  'Lag'      VARCHAR NOT NULL , " + 
		"  'Kat'      VARCHAR NOT NULL , " + 
		"  'Ismaskin' VARCHAR NOT NULL , " + 
		"  'Hemma'    VARCHAR NOT NULL , " + 
		"  'Borta'    VARCHAR NOT NULL , " + 
		"  'StartTid' VARCHAR NOT NULL , " +
		"  'StoppTid' VARCHAR NOT NULL , " +
		"  'Grupp'    VARCHAR NOT NULL, " +
		"  'OmklH'    VARCHAR NOT NULL, " +
		"  'OmklB'    VARCHAR NOT NULL, " + 
		"  'Notering' VARCHAR NOT NULL, " + 
		"  'IntNote'  VARCHAR NOT NULL, " + 
		"  UNIQUE(	    " +
        "    'Datum',		" +
        "    'StartTid',	" +
        "    'StoppTid',	" +
        "    'Lag',		" +
        "    'Kat'			" +
        "  )				" +
    		"  ON CONFLICT REPLACE	"	+
    		") ");
	
	/*
	 * Call this function every 24 hours
	 */
/*	
	setInterval(function() {
		this_week = today.getWeek();
		var r1 = Date.prototype.getDateRangeOfWeek(this_week);
		var r2 = Date.prototype.getDateRangeOfWeek(this_week + 5);
		Ti.API.info("--- INTERVAL: Setting date range:" + r1[0] + "/" + r2[1]);
		constructIstiderURL(r1[0], r2[1]);
		if (Titanium.Network.networkType != Titanium.Network.NETWORK_NONE) {
			Ti.API.info("--- DAILY REFRESH - UPDATING DATABASE NOW ---");
			checkDatabase();
		} else {
			// no network, lower interval so we detect when network is available?
		}
	}, 24 * 60 * 60 * 1000);
*/

/*
	if (Ti.Network.getOnline()) {
		Ti.API.info("First manual cache check now!");
		alert('calling checkDatabase');
		checkDatabase();
	}
*/

	/*
	 * STARTUP EVENTS
	 * app.init and app.start are available
	 */
	Ti.App.addEventListener("app.init", function(e) {
		
		/* Titanium.Network.addEventListener("change", function(e) {
			if (Ti.Network.getOnline()) {
				Ti.API.info("We're now online! - checking cache!");
				checkDatabase();
			} else {
				Ti.API.info("We're now offline!");
			}
		}); */
	});
	
	Ti.App.addEventListener("app.start", function(e) {
		Ti.API.info("db_module: Setting up handler for cache.do.update");
		
		Titanium.App.addEventListener("cache.do.update", function(params) {
			Ti.API.info("cache.do.update: calling checkDatabase");
			checkDatabase(params.force);
		});
	});

}

var resetDatabase = function() {
	my_db.execute("DELETE FROM istider");				  
	Titanium.App.Properties.setInt('lastUpdatedTS_v2', 0);
	Ti.API.fireEvent("update.db.time");
}

/*	1) check property "lastUpdatedTS_v2"
 * 	2) if 24 hrs has passed, or some error occurred
 * 
 * 
 */
var checkNeedsUpdating = function(nowTS) {
	var retval = false;
	lastUpdatedTS	= Titanium.App.Properties.getInt('lastUpdatedTS_v2');
	var timeDiff		= nowTS - lastUpdatedTS_v2;
	
	if (timeDiff > 86400 || timeDiff < 0) {
		Ti.API.info("--- MORE THAN 1 DAY HAS PASSED - DB NEEDS UPDATING ---");
		retval = true;
	}
	return retval;
};

/*
 * Sets module variables...
 */
var constructIstiderURL = function(start, stopp) {
	if (start === undefined || stopp === undefined) {
		Ti.API.error("Invalid argument to constructIstiderURL()");
		return;
	}
	return 'http://valbohcistider.se/apps/index.php?startdate=' + start + '&stopdate=' + stopp;
}

// load the cache contents from remote and store locally
var updateDatabase = function(nowTS, callback) {
	var xhr = Titanium.Network.createHTTPClient();

	xhr.callback = callback;
	// save it!

	
	var today = new Date();
	var this_week = today.getWeek();
	
	var range1 = today.getDateRangeOfWeek(this_week);
	var range2 = today.getDateRangeOfWeek(this_week + NUM_WEEKS_TO_LOAD - 1);
	
	var xhrURL = constructIstiderURL(range1[0], range2[1]);

	Ti.API.info("--- UPDATING CACHE ---");
	xhr.onload = function() {
		Ti.API.info("--- DATA RECEIVED ---");
		try {
			var json_data = JSON.parse(xhr.responseText);
			/*
			 * Loop thru all data and update the database
			 */
			if (json_data.length > 0) {
				my_db.execute("BEGIN");
				var len = json_data.length;
				for (var i = 0; i < len; i++) {
					var value = json_data[i];
					Ti.API.info("Updating/Inserting:" + JSON.stringify(value));
					my_db.execute('REPLACE INTO istider (VERSION, TBLDATE, Datum, Grupp, Lag, Kat, Ismaskin, Hemma, Borta, StartTid, StoppTid, OmklH, OmklB, Notering, IntNote) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
						1, '2012-10-15', 
						value.Datum, value.Grupp, value.Lag, value.Kat, value.Ismaskin, value.Hemma, value.Borta, value.StartTid, value.StoppTid,
						value.OmklH, value.OmklB, value.Notering, value.IntNote == undefined ? "" : value.IntNote);
				}
				my_db.execute("COMMIT");
				Titanium.App.Properties.setInt('lastUpdatedTS_v2', nowTS);
				Ti.API.fireEvent("update.db.time");
				if (xhr.callback !== undefined)
					xhr.callback('OK');
			}
			else {
				// no data??????
				if (xhr.callback !== undefined)
					xhr.callback('NO DATA');
			}
			
		} catch (e) {
			//my_db.execute("ROLLBACK"); undersök!
			Ti.API.error("Error: " + e.name + " " + e.message);
			
			if (xhr.callback !== undefined)
				xhr.callback('ERROR');
		}


		Ti.API.info("--- DONE UPDATING CACHE ---");
	};

	xhr.onerror = function(e) {
		Ti.API.error("--- ERROR UPDATING CACHE : " + e.name + " " + e.message);
		if (xhr.callback !== undefined)
			xhr.callback('ERROR');
	};

	xhr.setTimeout(15000);
	xhr.open('GET', xhrURL);
	Ti.API.info("--- UPDATING CACHE : Executing GET of " + xhrURL);
	xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A537a Safari/419.3');
	xhr.send();
};

/*	----------------------------------------------------------------------------------------
 * 	checkDatabase()
 *  If we need to update we will:
 *  0) calculate a date range from this week and 10 weeks forward
 * 	1) send cache.update.started
 * 	2) call updateDatabase()
 * 	3) send cache.updated.finished
 * 	----------------------------------------------------------------------------------------
 */
var checkDatabase = function(force) {

	if (force !== undefined) {
		force_it = force;	
	}
	else {
		force_it = false;
	}
	
	Ti.API.info("--- Checking cache now ---");
	var currentTS = getCurrentTime();
	if ((force_it || checkNeedsUpdating(currentTS))) {
	
		Ti.API.info("--- OK It needed update! ---");
		Ti.App.fireEvent("cache.update.started", {});
		
		updateDatabase(currentTS, function(sts) {
			Ti.App.fireEvent("cache.update.finished", {status : sts});
		});
	}
	else {
		Ti.API.info("--- NO NEED TO UPDATE CACHE ---");
		Ti.App.fireEvent("cache.update.finished", {status : 'CACHED'});
	}
}

var getCurrentTime = function() {
	var ts = parseInt(((new Date().getTime()) / 1000), 10); // Seconds since UNIX epoch
	return ts;	
}

/*	----------------------------------------------------------------------------------------
 * 	getWeekDataFromDatabase() : can only be called from event handler "cache.update.finished"
 * 
 * 	1) get Date range of week, for example 10/8 to 17/8
 * 	2) if cached range differs from 10/8 to 17/8, load data from SQL
 * 	3) update 'cached_records' variable  (change to cached_data_for_week_X)
 * 	----------------------------------------------------------------------------------------
 */
var getWeekDataFromDatabase = function(week) {

	var now = new Date();
	var date_range = now.getDateRangeOfWeek(week);
	
	Ti.API.info("Week " + week + " is calcuated to be date range:" + date_range[0] + " to " + date_range[1]);
	
	var sqlstr = 'SELECT Datum, Grupp, Lag, Kat, Ismaskin, Hemma, Borta, StartTid, StoppTid FROM istider where Datum >= ? and Datum <= ?';
	Ti.API.info("Exec:" + sqlstr);
	Ti.API.info("Param0:" + date_range[0] + " Param1:" + date_range[1]);
	var resultset = my_db.execute(sqlstr, date_range[0], date_range[1]);
	
	var records = [];

	try {
		while (resultset.isValidRow()) {

			record = {
				'Datum' : resultset.fieldByName('Datum'),
				'Grupp' : resultset.fieldByName('Grupp'),
				'Lag' : resultset.fieldByName('Lag'),
				'Kat' : resultset.fieldByName('Kat'),
				'Ismaskin' : resultset.fieldByName('Ismaskin'),
				'Hemma' : resultset.fieldByName('Hemma'),
				'Borta' : resultset.fieldByName('Borta'),
				'StartTid' : resultset.fieldByName('StartTid'),
				'StoppTid' : resultset.fieldByName('StoppTid')
			}
			Ti.API.info("Found a row in database : " + JSON.stringify(record));
			records.push(record);
			resultset.next();
		}
		resultset.close();
	} catch (ex) {
		Ti.API.error("Exception! " + JSON.stringify(ex));
	}

	return records;
}

/*	----------------------------------------------------------------------------------------
 *  private function
 *	----------------------------------------------------------------------------------------
 */
var makeWhereClauseOfSelectedTeams = function() {
	try {
		var teams = ['U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'B-JUN', 'B-JUN:2', 'A-JUN', 'A'];
		var where_clause = " WHERE ";
		var count = 0;
		for ( index = 0; index < teams.length; index++) {
			var on = Ti.App.Properties.getBool(teams[index], /* default */false);
			if (on) {
				if (count > 0) {
					separator = " OR "
				} else {
					separator = "";
				}
				if (teams[index] === 'A') {
					where_clause = where_clause + separator + " (Grupp = 'A' or Lag = 'A') "
				} else {
					where_clause = where_clause + separator + " (Grupp LIKE '%" + teams[index] + "%' or Lag LIKE '%" + teams[index] + "%' ) "
				}
				count++;
			}
		}
		if (count == 0) {
			Ti.API.info("--- EMPTY WHERE CLAUSE RETURNED! ---");
			return " WHERE ";
		} else {
			Ti.API.info("--- RETURNED " + where_clause + " ---");
			return where_clause + " and ";
		}
	} catch (exc) {
		alert(JSON.stringify(exc));
		return "";
	}
}
/*	----------------------------------------------------------------------------------------
 *
 *	----------------------------------------------------------------------------------------
 */
var getMyTeams = function() {
	var teams = ['U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'B-JUN', 'B-JUN:2', 'A-JUN', 'A'];
	var sel_teams = [];
	for ( index = 0; index < teams.length; index++) {
		var on = Ti.App.Properties.getBool(teams[index], /* default */false);
		if (on) {
			sel_teams.push(teams[index]);
		}
	}
	return sel_teams;
}
/*
 * Picks up selected teams from Properties!
 *
 */
var getMyTeamData = function(onlymatches) {

	Ti.API.info("getMyTeamData(" + onlymatches + ")");
	
	var today_str = new Date().getDateAsStr();
	var where_statement = makeWhereClauseOfSelectedTeams();
	var sql = "SELECT Datum, Grupp, Lag, Kat, Ismaskin, Hemma, Borta, StartTid, StoppTid FROM istider " + where_statement + " Datum >= '" + today_str + "'";
	Ti.API.info("Exec:" + sql);
	var resultset = my_db.execute(sql);
	var records_myteam = [];

	try {
		while (resultset.isValidRow()) {
			var record_myteam = {
				'Datum' : resultset.fieldByName('Datum'),
				'Grupp' : resultset.fieldByName('Grupp'),
				'Lag' : resultset.fieldByName('Lag'),
				'Kat' : resultset.fieldByName('Kat'),
				'Ismaskin' : resultset.fieldByName('Ismaskin'),
				'Hemma' : resultset.fieldByName('Hemma'),
				'Borta' : resultset.fieldByName('Borta'),
				'StartTid' : resultset.fieldByName('StartTid'),
				'StoppTid' : resultset.fieldByName('StoppTid')
			}
			Ti.API.info("Record:" + JSON.stringify(record_myteam));
			if (onlymatches) {
				if (record_myteam.Kat === 'M')
					records_myteam.push(record_myteam);
			}
			else
				records_myteam.push(record_myteam);
			resultset.next();
		}
		resultset.close();
	} 
	catch (ex) {
		Ti.API.error("Exception! " + JSON.stringify(ex));
	}

	return records_myteam;
}

exports.init = init;
exports.constructIstiderURL = constructIstiderURL;
exports.resetDatabase = resetDatabase;
exports.checkNeedsUpdating = checkNeedsUpdating;
exports.updateDatabase = updateDatabase;
exports.checkDatabase = checkDatabase;
exports.getWeekDataFromDatabase = getWeekDataFromDatabase;
exports.makeWhereClauseOfSelectedTeams = makeWhereClauseOfSelectedTeams;
exports.getMyTeams = getMyTeams;
exports.getMyTeamData = getMyTeamData;

