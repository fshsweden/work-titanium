//determine platform and form factor and render approproate components
var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;

//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
//yourself what you consider a tablet form factor for android
var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

exports.isiPhone  = function() {
	return osname === 'iphone';
}

exports.isiPad = function() {
	return osname === 'ipad';
}
