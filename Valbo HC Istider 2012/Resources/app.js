/*
 * Valbo HC Istider 2012  
 *  
 * Requires Titanium Mobile SDK 1.8.0+.
 * 
 *  
 */
Ti.include('/ui/common/date_addons.js');
var tabgrp;
var NUM_WEEKS_TO_LOAD = 5;



//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}
else {

	(function() {

		var string_functions	= require('ui/common/string_functions');
		string_functions.init();
		
		var tools		= require('ui/common/tools');
		tools.init();
	
		var themes		= require('ui/common/themes');
		
		var db_module	= require('ui/common/db_module');
		db_module.init(); 
		
		var istider_data	= require('ui/common/istider_data');
		istider_data.init();
		
		/*var page1		= require('ui/common/page1');
		page1.init();*/
		
		var page2		= require('ui/common/page2');
		page2.init();
	
		var page3		= require('ui/common/page3');
		page3.init();
		
		var page4		= require('ui/common/page4');
		page4.init();
		
/*		var page5		= require('ui/common/page5');
		page5.init();
*/		
		var application_tabgroup	= require('ui/common/applicationtabgroup');
		application_tabgroup.init();
		tabgrp = application_tabgroup.createApplicationTabGroup();
		tabgrp.open();
		
		//alert('require globals');
		//var globals = require ('/ui/common/globals');
		//alert('Ti.UI.createTabGroup();');
		//var tabGroup = Ti.UI.createTabGroup();
		//globals.set ('tabGroup', tabGroup);
		
		var istodsentryform	= require('ui/common/istidsentryform');
		
		Ti.API.info("***** sending app.init *****");
		Ti.App.fireEvent("app.init");
		
		Ti.API.info("***** sending app.start *****");
		Ti.App.fireEvent("app.start");
	
		/*
		 * 
		 */
		var areWeOnline = false;
		var firstUpdateDone = false;
		
		handleOnlineState(Ti.Network.online, Ti.Network.networkTypeName);

		Ti.Network.addEventListener("change", function(e) {
			handleOnlineState(e.online, e.networkTypeName);
		});
		
		function handleOnlineState(online, network, evt) {
			if (online) {
				// What should we do
				areWeOnline = true;
				checkDoFirstUpdate();
				Ti.API.fireEvent("network.online");
			}		
			else {
				areWeOnline = false;
				Ti.API.fireEvent("network.offline");
				alert("Saknar internetanslutning!");
			}
		}
		
		function checkDoFirstUpdate() {
			if (areWeOnline && !firstUpdateDone) {
				setTimeout(
					function() {
							Ti.API.info("***** sending cache.do.update *****");
							Ti.App.fireEvent("cache.do.update");
							firstUpdateDone=true;
					},
					2000
				);
			}
		}

		/*
		 * Poll every 15 minutes and take action
		 */		
		setInterval(function() {
			today = new Date();
			if (today.getHours() == 3) {
				// istider_data.checkDatabase();			
			}
		}, 1 * 15 * 60 * 1000); // every 15 minutes
		
	})();
}

