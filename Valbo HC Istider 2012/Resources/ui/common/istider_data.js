"use strict";

/*
 *	contains:
 * 	exports.isMyTeam = function(value)
 * 	exports.ConvertJsonToTableViewRowArray = function(page_tab,todayStr,	data)
 *
 */

Ti.API.info("istider_data loaded");

var string_tools   = require('/ui/common/string_functions');
var openform       = require('/ui/common/openform');
var db_module      = require('/ui/common/db_module');
var platform_tools = require('/ui/common/platform_tools');

Ti.include('/ui/common/date_addons.js');

var today = new Date();
var start_week = today.getWeek(1);

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
	today = new Date();
	start_week = today.getWeek(1);
}
/*
 *
 */
var isMyTeam = function(value) {

	// compare 'value' with 'teams' properties!
	var teams = db_module.getMyTeams();

	for ( i = 0; i < teams.length; i++) {

		var team = teams[i];

		if (team === 'A') {
			if (value.Hemma === "A" || value.Borta === "A") {
				return true;
			} else if (value.Lag === 'A') {
				return true;
			} else if (value.Grupp === 'A') {
				return true;
			} else {

			}
		} else {
			if (value.Hemma.indexOf(team, 0) != -1 || value.Borta.indexOf(team, 0) != -1) {
				return true;
			} else if (value.Lag.indexOf(team, 0) !== -1) {
				return true;
			} else if (value.Grupp.indexOf(team, 0) !== -1) {
				return true;
			} else {

			}
		}
	}

	return false;
}
/*
 * 	function
 *
 *
 *
 *
 */
var ConvertJsonToTableViewRowArray = function(page_tab, todayStr, data) {

	var sections = [];
	/* Array of TableViewSections */
	var curr_section;
	var curr_row;

	// CATEGORIES:  T=PRACTICE, M=MATCH, V=WARMUP 
	var default_bg_color = "#FAFAFA";
	var default_fg_color = "#000000";
	
	var practice_bg_color		= 'white';
	var practice_bg_color_myteam	= '#F2EDAF';
	var practice_fg_color		= 'black';
	var practice_fg_color_myteam	= 'black';
	
	var match_fg_color          	= '#FFFFFF';
	var match_fg_color_myteam 	= '#FFFFFF';
	var match_bg_color          	= '#A00000';
	var match_bg_color_myteam	= '#F00000';
	
	var warmup_bg_color			= 'white';
	var warmup_bg_color_myteam	= 'cyan';
	var warmup_fg_color			= 'black';
	var warmup_fg_color_myteam	= 'black';

//	var team_color				= '#F1AEB2';
//	var team_highlight_color		= '#F1CEC2';
	
//	var soft_color = '#F2EDAF';
	var gray_color = '#c0c0c0';
//	var red_color             = '#FF0000';
	
	var old_date = 'AnyValueExceptBlank!';
	var days = ['SÖNDAG', 'MÅNDAG', 'TISDAG', 'ONSDAG', 'TORSDAG', 'FREDAG', 'LÖRDAG'];
	
	var tbBorderColor = '#000000';
	var tbRowBgColor;
	var tbRowFgColor;

	var lag;
	var kat;
	var ismaskin;
	var match;
	var tidText;
	var fStyle;
	
	var team_match_offset = platform_tools.isiPhone() ? 110 : 200;

	var len = data.length;
	Ti.API.info("Data length:" + data.length);

	/*	-----------------------------------------------------------------------------------------
	 *	Optimera denna loop!
	 *
	 *
	 *	-----------------------------------------------------------------------------------------
	 */
	for (var i = 0; i < len; i++) {

		var value = data[i];
		var item_is_today = false;

		if (value.Datum !== old_date) {
			/*
			 * Create a new section
			 */
			var year = value.Datum.substr(0, 4);
			var mnth = ((value.Datum.substr(5, 2)) - 1);
			var day = value.Datum.substr(8, 2);
			dd = new Date(year, mnth, day, 0, 0, 0);
		
			var hdrview = Ti.UI.createView({
				
			});
			var datumLabel = Ti.UI.createLabel({
				color	: 'white',
				text		: days[dd.getDay()] + " " + value.Datum,
				height	: Ti.UI.SIZE,
				left 	: (isSmartPhone ? 20 : 50),
				font		: (isSmartPhone ? {fontSize : 14, fontWeight : 'bold'} : {fontSize : 22,  fontWeight : 'bold' })
			});
			hdrview.add(datumLabel);
			
			curr_section = Ti.UI.createTableViewSection({
				/* we should use a headerView instead */
				headerView : hdrview,
				//headerTitle: days[dd.getDay()] + " " + value.Datum,
				color: '#f0f0f0'
			});

			sections.push(curr_section);
			Ti.API.info("Creating new Table section:" + value.Datum);
		}

		lag = String(value.Lag);
		tbRowBgColor = default_bg_color;
		tbRowFgColor = default_fg_color;
		
		kat = "";

		/*
		 * NORMALIZE KATEGORI
		 */
		switch (value.Kat) {
			case 'T':
			case ' ':
			case '':
				kat = "T";
				// Ti.API.info("Kategori is TRÄNING (" + value.Kat + ")");
				break;
			default:
				// Ti.API.info("Kategori is:" + value.Kat);
				kat = value.Kat;
				break;
		}

		/*
		 * ISMASKIN
		 */
		if (value.Ismaskin === '') {
			ismaskin = "-''-";
		} else {
			ismaskin = value.Ismaskin;
		};

		switch (value.Lag) {
			case 'V':
				lag = "MATCHV.";
				break;
			case '- -':
				lag = "";
				break;
			default:
				lag = value.Lag;
				break;
		}

		/*
		 * MATCH
		 */
		if (kat === 'M') {
			if (value.Hemma === 'undefined' || value.Borta === 'undefined' || value.Hemma === '' || value.Borta === '' || value.Hemma === null || value.Borta === null) {
				// Ti.API.info("Hemma or Borta == undefined, so detting default label! " + JSON.stringify(value));
				match = "Matchtid";
			} else {
				match = string_tools.str_pad((value.Grupp + " " + value.Hemma + " - " + value.Borta), 32, ' ', 'STR_PAD_RIGHT');
				// Ti.API.info("Created MATCH: " + match);
			}
		} else {
			// Ti.API.info("Kat is " + JSON.stringify(kat) + " so match = nothing!");
			match = "";
		}

		/*
		 * SET COLORS DEP. ON WHETHER DAY IS PASSED OR CURRENT
		 */
		
		/*if (value.Datum === todayStr) {
			tbViewBgColor = team_color;
			fgcol = black_color;
			item_is_today = true;
			tbBorderColor = red_color;*/
		
		/*
		 * PASSED DAYS GET GRAY BG COLOR. ELSE WE SET COLORS DEP ON TYPE
		 * OF USAGE.
		 */
		if (value.Datum < todayStr) {
			tbRowBgColor = gray_color;
			tbRowFgColor = 'black';
			fStyle = 'normal';
		} 
		else {
			
			/*
			 * DIFFERENT COLORS ON
			 * - PRACTICE (T)
			 * - MATCH (M)
			 * - WARMUP (V)
			 */
			switch(kat) {
				case 'T':
					if (isMyTeam(value)) {
						tbRowBgColor = practice_bg_color_myteam;
						tbRowFgColor	 = practice_fg_color_myteam; 
					} else {
						tbRowBgColor = practice_bg_color;
						tbRowFgColor	 = practice_fg_color; 
					}
					fStyle = 'bold';
				break;
				case 'M':
					if (isMyTeam(value)) {
						tbRowBgColor = match_bg_color_myteam;
						tbRowFgColor	 = match_fg_color_myteam; 
					} else {
						tbRowBgColor = match_bg_color;
						tbRowFgColor	 = match_fg_color; 
					}
					fStyle = 'bold';
				break;
				case 'V':
					if (isMyTeam(value)) {
						tbRowBgColor = warmup_bg_color_myteam;
						tbRowFgColor	 = warmup_fg_color_myteam; 
					} else {
						tbRowBgColor = warmup_bg_color;
						tbRowFgColor	 = warmup_fg_color; 
					}
					fStyle = 'bold';
				break;
				default:
					tbRowBgColor = default_bg_color;
					tbRowFgColor = default_fg_color;
					fStyle = 'normal';
				break;
			}
		}


		/*
		 * THE TIME LABEL
		 */
		tidText = value.StartTid + '-' + value.StoppTid;

		var f;
		var rowheigh = 20;
		
		/*
		 * IPHONE
		 */
		
		if (isSmartPhone) {
			f = {
				fontName : 'Helvetica',
				fontSize : 14,
				fontWeight : fStyle
			};
			rowheight = 20;
		}
		else if (isTablet){
			f = {
				fontName : 'Helvetica',
				fontSize : 22,
				fontWeight : fStyle
			};
			rowheight = 30;
		}

		var tidLabel = Ti.UI.createLabel({
			text				: tidText,
			height			: Ti.UI.SIZE,
			font				: f,
			backgroundColor	: 'transparent',
			color			: tbRowFgColor,
			left 			: 20/*,	top : -2*/
		});
		
		/*
		 * We use TEAMLABEL or MATCHLABEL
		 * They overlap and one of them will be empty....
		 */
		var teamLabel = Ti.UI.createLabel({
			text 			: string_tools.str_pad(lag, 16, ' ', 'STR_PAD_RIGHT'),
			height 			: Ti.UI.SIZE,
			font 			: f,
			backgroundColor	: 'transparent',
			color			: tbRowFgColor,
			left 			: team_match_offset/*,	top : -2*/
		});
		
		var matchLabel = Ti.UI.createLabel({
			text 			: string_tools.str_pad(match, 32, ' ', 'STR_PAD_RIGHT'),
			height 			: Ti.UI.SIZE,
			font 			: f,
			backgroundColor	: 'transparent',
			color			: tbRowFgColor,
			left 			: team_match_offset/*,	top : -2*/
		});

		curr_row = Ti.UI.createTableViewRow({
			className		: 'istimme',
			height			: rowheight, // TODO: Make param!
			borderColor		: 'black',	 // TODO: Make param!
			borderWidth		: 1,			 // TODO: Make param!
			backgroundColor	: tbRowBgColor,
			color			: tbRowFgColor,
			hasChild			: true,
			stow_away		: value		// The source data!
		});

		Ti.API.info("Datum:'" + value.Datum + " Tid:" + tidText + " Team:" + lag + " Match:" + match);


		/*
		 * When clicked, show details
		 */
		curr_row.addEventListener("click", function(evt) {

			Ti.API.info("evt=" + JSON.stringify(evt));
			var v = evt.row.stow_away;
			Ti.API.info("v=" + JSON.stringify(v));

			var new_win = openform.open({
				'Grupp' : v.Grupp,
				'Lag' : v.Lag,
				'Kategori' : v.Kat,
				'Ismaskin' : v.Ismaskin,
				'Hemma' : v.Hemma,
				'Borta' : v.Borta,
				'StartTid' : v.StartTid,
				'StoppTid' : v.StoppTid
			});

			page_tab.open(new_win);
		});

		curr_row.add(tidLabel);
		curr_row.add(teamLabel);
		curr_row.add(matchLabel);

		curr_section.add(curr_row);

		old_date = value.Datum;
	}

	return sections;
}

exports.isMyTeam = isMyTeam;
exports.ConvertJsonToTableViewRowArray = ConvertJsonToTableViewRowArray;
exports.init = init;
