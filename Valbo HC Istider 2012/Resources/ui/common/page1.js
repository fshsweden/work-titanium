/*
 *
 *
 */

exports.init = function() {
	
}

/*	---------------------------------------------------
 *	Set up createFooWin function
 *
 *  ---------------------------------------------------
 */

exports.createWebWin = function() {

	var win = Ti.UI.createWindow({
		//backgroundColor: "green",
		title : "Nyheter",
		barColor : '#336699'
	});

	var bg = Ti.UI.createImageView({
		backgroundImage : ""
	});

	var splash = Ti.UI.createWindow({
		top : "15%",
		width : "60%",
		bottom : "15%",
		height : "60%",
		backgroundColor : "red"
	});

	var web = Ti.UI.createWebView({
		url : "http://www.valbohc.se",
		scalesPageToFit : true,
		top : '0%',
		width : '100%',
		left : '0%',
		height : '100%',
		backgroundColor : "transparent",
		visible : "true"
	});
	win.add(web);

	var img = Ti.UI.createImageView({
		image : '/beta.png',
		width : 150,
		height : 150
	});
	win.add(img);

	/*
	 web.addEventListener("load", function() {
	 web.show();
	 });
	 */

	setTimeout(function() {
		img.hide();
	}, 5000);

	return win;
};

