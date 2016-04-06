
var themes = {};

themes['iphone_standard']={};
themes['iphone_standard']['istider_tableview'] = {
	fontName	: 'Helvetica',
	fontSize	: 14,
	fontWeight	: 'normal',
	rowHeight	: 20	
};

themes['android_standard'] = {};
themes['android_standard']['istider_tableview'] = {
	fontName	: 'Helvetica',
	fontSize	: 16,
	fontWeight	: 'normal',
	rowHeight	: 22	
};

themes['ipad_standard']={};
themes['ipad_standard']['istider_tableview'] = {
	fontName	: 'Helvetica',
	fontSize	: 14,
	fontWeight	: 'normal',
	rowHeight	: 20	
};

var getTheme = function(name) {
	return themes[name];	
}

exports.getTheme = getTheme;
