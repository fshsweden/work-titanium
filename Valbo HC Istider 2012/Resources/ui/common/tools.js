

var init = function() {
	
}

var getMethods = function(obj) {
	var result = [];
	for (var id in obj) {
		try {
			if ( typeof (obj[id]) == "function") {
				result.push(id + ": function"/* + obj[id].toString() */);
			} else {
				result.push(id + ": variable");
			}
		} catch (err) {
			result.push(id + ": inaccessible");
		}
	}
	return result;
}

var getToday = function() {
	var d = new Date();
	var month_no = d.getMonth() + 1; // months are 0-based normally
	var month = month_no < 10 ? ("0"+month_no) : month_no;
	var date  = d.getDate() < 10 ? ("0"+d.getDate()) : d.getDate();
	return d.getFullYear() + "-" + month + "-" + date;
}

/*
 *	Calculate the date range from the Monday on this week + 'numweeks' weeks
 */
var calcDateRangeFromMondayThisWeek = function(numweeks) {

	today = new Date();
	week = today.getWeek();
	
	range1 = today.getDateRangeOfWeek(week);
	range2 = today.getDateRangeOfWeek(week + numweeks - 1);

	var range = new Array();
	range[0] = range1[0];
	range[1] = range2[1];
	return range;
}

exports.init								=	init;
exports.getToday							=	getToday;
exports.getMethods						=	getMethods;
exports.calcDateRangeFromMondayThisWeek	=	calcDateRangeFromMondayThisWeek;
