/*jslint node: true */
/* "use strict"; */
/* Ti.include('/ui/common/date-sv-SE.js'); */

/*
* This module is supposed to be INCLUDED in your source
* It adds some methods to the Date object (or 'class')
*/

/* Date */ Date.prototype.parseDate = function (input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	// CHECK THAT WE ARE CREATED WITH 'NEW'
	if (!(this instanceof Date)) {
		return new Date().getWeek(dowOffset);
	}

	Ti.API.info("----- Calculating week number using getWeek(" + this.toLocaleDateString() + ") -----");

	// CLEAN UP PARAMETERS
	if (dowOffset === undefined) {
		dowOffset = 1;
	}
	dowOffset = typeof (dowOffset) === 'int' ? dowOffset : 1;
	
	var newYear = new Date(this.getFullYear(), 0, 1);  // 1st day of new year
	var day     = newYear.getDay() - dowOffset;		  // 
	
	// THE DAY OF THE WEEK THAT THE YEAR BEGINS ON
	day = (day >= 0 ? day : day + 7);
	Ti.API.info("      Year " + this.getFullYear() + " starts on day# " + day );
	
	// NOW GET THE DAYNUMBER OF TODAY
	var daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
	Ti.API.info("      This day's number is " + daynum);

	var weeknum;
	//if the year starts before the middle of a week
	if (day < 4) {
		weeknum = Math.floor((daynum + day - 1) / 7) + 1;
		if (weeknum > 52) {
			var nYear = new Date(this.getFullYear() + 1, 0, 1),
				nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/* if the next year starts before the middle of
			 the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	} else {
		weeknum = Math.floor((daynum + day - 1) / 7);
	}
	
	Ti.API.info("----- getWeek(" + this.toLocaleDateString() + ") returns: " + weeknum);
	return weeknum;
};

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

/*
 * This code works now but does NOT work when wrapping a new year..... for some reason...
 */
Date.prototype.getDateRangeOfWeek = function (weekNo) {

	Ti.API.info("(BUGGY)getDateRangeOfWeek starting");
	      
	if (!(this instanceof Date)) {
		return new Date().getDateRangeOfWeek(weekNo);
	}
	
	var d1 = new Date();
	var numOfdaysPastSinceLastMonday = eval(d1.getDay() - 1);
	
	Ti.API.info("(BUGGY) This is probably wrong: numOfdaysPastSinceLastMonday should be 1 but is " + numOfdaysPastSinceLastMonday);
	
	d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
	var weekNoToday = d1.getWeek();
	
	Ti.API.info("(BUGGY) weekNoToday is calculated to be " + weekNoToday);
	
	var weeksInTheFuture = eval(weekNo - weekNoToday);
	Ti.API.info("(BUGGY) weeksInTheFuture is calculated to be " + weeksInTheFuture);
	d1.setDate(d1.getDate() + eval(7 * weeksInTheFuture));

	Ti.API.info("(BUGGY) d1 was calculated to be " + d1.toLocaleDateString());

	var month1 = eval(d1.getMonth() + 1);
	if (month1 < 10) {
		month1 = "0" + month1;
	}

	var day1 = eval(d1.getDate());
	if (day1 < 10) {
		day1 = "0" + day1;
	}		

	var rangeIsFrom = d1.getFullYear() + "-" + month1 + "-" + day1;
	Ti.API.info("     BUGS GALORE:  rangeIsFrom:" + rangeIsFrom);

	d1.setDate(d1.getDate() + 6);

	var month2 = eval(d1.getMonth() + 1);
	if (month2 < 10) {
		month2 = "0" + month2;
	}

	var day2 = eval(d1.getDate());
	if (day2 < 10) {
		day2 = "0" + day2;
	}

	var rangeIsTo = d1.getFullYear() + "-" + month2 + "-" + day2;
	Ti.API.info("     BUGS GALORE:  rangeIsTo:" + rangeIsTo);

	var range = new Array();
	range[0] = rangeIsFrom;
	range[1] = rangeIsTo;
	
	Ti.API.info("(BUGGY)getDateRangeOfWeek ending with result ==>" + range[0] + " to " + range[1]);
	
	return range;
};

Date.prototype.getDateAsStr = function() {
	
	if (!(this instanceof Date)) {
		return new Date().getDateAsStr();
	}
	
	var month1 = eval(this.getMonth() + 1);
	if (month1 < 10) {
		month1 = "0" + month1;
	}

	var day1 = eval(this.getDate());
	if (day1 < 10) {
		day1 = "0" + day1;
	}

	var dstr = this.getFullYear() + "-" + month1 + "-" + day1;
	return dstr;
};

Date.prototype.mv_leapck = function (yy, dorf) {
   //   dorf = 1=Days or 0=Flag

   if(new Date(yy,1,29).getDate() == 29)
      return(1 + (dorf==1 ? 365 : 0));
   else
      return(0 + (dorf==1 ? 365 : 0));
}

Date.prototype.mv_isDateObject = function(d) {
   if (typeof d == 'object') {
      if(d.getTime === undefined)
         return(0);
      else;
         return(1);
   } else
      return(0);
}

Date.prototype.mv_dateToString = function(datum, format) {
   /*
      IN:
         YYYYMMDD
         YYYYDDD
         YYYYWW or YYYYMM
         or a date object
      OUT:
         Anything. Depends on format.
         %d = day (DD or DDD)
         %m = month
         %w = week
         %y = yy
         %Y = yyyy
   */
   var txt = '';
   var fmt = new String(format);

   if(mv_isDateObject(datum)) 
      txt = new String(datum.getFullYear() * 10000 + (datum.getMonth() + 1) * 100 + datum.getDate());
   else
      txt = new String(datum);

   if(txt.length >= 6) {
      fmt = fmt.replace('%y', txt.substr(2,2));
      fmt = fmt.replace('%Y', txt.substr(0,4));

      if(txt.length == 8) {
         fmt = fmt.replace('%m', txt.substr(4,2));
         fmt = fmt.replace('%d', txt.substr(6,2));
      }
      else if(txt.length == 7) 
         fmt = fmt.replace('%d', txt.substr(4,3));
      else if(txt.length == 6) 
         fmt = fmt.replace('%w', txt.substr(4,2));
   }

   return(fmt);
}

Date.prototype.mv_mondayOfWeek = function(yy, ww, mdd) {
	
      Ti.API.info("debug0: mondayOfWeek(" + yy + "," + ww + "," + mdd + ")");
 	
   /*
      MONDAY returns the day number or the date 
      of the monday in the week ww of year yy.

      IN:
      - 4-digit year
      - weeknumber
      - mdd = 2=Milliseconds, 1=Day or 0=Date
         
      OUT: 
      - Day = YYYYDDD (DDD = Day number in year YYYY)
      - Date = YYYYMMDD
   */
   var daymsec = 1000*60*60*24;
   var wrk1 = wrk2 = 0;

   // Calculate offset
   wrk1 = yy - 1900 + parseInt((yy - 1900 - 1) / 4);
   wrk1 -= parseInt(wrk1 / 7) * 7;
   if(wrk1 > 3) wrk1 -= 7;
   wrk2 = (ww * 7) - wrk1 - 6;

   if (wrk1 < 0 && ww == 53) {
      yy--;
      wrk2 -= 371;
      wrk2 += this.mv_leapck(yy, 1);
   }
   else if (wrk2 <= 0) {
      yy--;
      wrk2 += this.mv_leapck(yy, 1);
   }

   // Format return value
   if(isNaN(parseInt(mdd)) || parseInt(mdd) == 0) {
      Ti.API.info("debug1: wrk1 = " + JSON.stringify(wrk1) + " wrk2=" + JSON.stringify(wrk2));
      
      wrk1 = (new Date(yy-1, 11, 31)).getTime();
      wrk1 += wrk2 * daymsec; // in milliseconds
      wrk2 = new Date();
      wrk2.setTime(wrk1);   // Date of monday in week ww
      wrk1 = wrk2.getFullYear() * 10000 + (wrk2.getMonth() + 1) * 100 + wrk2.getDate();
      
      /* calc date of last day of week too */
      wrklast = new Date();
      wrklast.setDate(wrk2.getDate() + 6);
      
      Ti.API.info("debug2: = " + JSON.stringify(wrk1) + " and " + JSON.stringify(wrk2) + " to " + JSON.stringify(wrklast));
      
      var hack = wrk2.getMonth() == 11 ? 0 : 1;
      wrklastday = wrklast.getFullYear() * 10000 + (wrklast.getMonth() + hack) * 100 + wrklast.getDate();
      
   } else if(parseInt(mdd) == 2) {
   	  alert("Code error: Alpha");
      wrk1 = (new Date(yy-1, 11, 31)).getTime();
      wrk1 += wrk2 * daymsec; // in milliseconds
   } else {
   	  alert("Code error: Beta");
      wrk1 = (yy * 1000) + wrk2;
   }
            
   return([wrk1,wrklastday]);   // Date or Day of monday
}
