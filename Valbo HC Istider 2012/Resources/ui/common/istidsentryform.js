/*
 * We avoid polluting the global namespace by keeping all code and local data 
 * in a function object.
 *
 * We keep exported data/functions in the page2 object 
 * 
 */
var istidsentryform ={};

(function(){
	
	istidsentryform.createForm = function(data) {
		var win = Ti.UI.createWindow({
			backGroundColor: "green"
		});
		
		var view = Titanium.UI.createView({
		   borderRadius:10,
		   backgroundColor:'white'
		});
		
		view.add(Ti.UI.createButton({title:"HEJ 1", width:60, height:20}));
		view.add(Ti.UI.createButton({title:"HEJ 2", width:60, height:20}));
		view.add(Ti.UI.createButton({title:"HEJ 3", width:60, height:20}));
		view.add(Ti.UI.createButton({title:"HEJ 4", width:60, height:20}));
		view.add(Ti.UI.createButton({title:"HEJ 5", width:60, height:20}));
		view.add(Ti.UI.createButton({title:"HEJ 6", width:60, height:20}));
		
		win.add(view);
		return win;
	};
})();
