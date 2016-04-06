/*
 *
 *
 *
 */

Ti.API.info("openforms loaded");

var forms = require('/ui/common/forms');
var win;
var form;

var fields = [{
	title : 'Kategori',
	type : 'text',
	id : 'Kategori'
}, {
	title : 'Lag',
	type : 'text',
	id : 'Lag'
}, {
	title : 'StartTid',
	type : 'text',
	id : 'StartTid'
}, {
	title : 'StoppTid',
	type : 'text',
	id : 'StoppTid'
}, {
	title : 'Ismaskin',
	type : 'text',
	id : 'Ismaskin'
}, {
	title : 'Hemma',
	type : 'text',
	id : 'Hemma'
}, {
	title : 'Borta',
	type : 'text',
	id : 'Borta'
}, {
	title : 'Grupp',
	type : 'text',
	id : 'Grupp',
	value : 'DEFAULT'
}];

exports.open = function(field_values) {
	win = Ti.UI.createWindow({
		backgroundColor : 'gray'
	});
	form = forms.createForm({
		style : forms.STYLE_LABEL,
		fields : fields
	});

	Ti.API.info("openform.open()" + JSON.stringify(field_values));
	if (field_values !== undefined) {
		for (var i in field_values) {
			Ti.API.info("openform.open()" + JSON.stringify(i));
			Ti.API.info("openform.open()" + JSON.stringify(field_values[i]));

			form.fieldRefs[i].value = field_values[i];
		}
	}

	win.add(form);
	return win;
}
