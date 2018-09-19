// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

Ti.API.info(JSON.stringify(args, null, 4));
$.nombreSorteo.text = args.sorteo;

args.boletos.forEach(function(boleto) {
	var label = Ti.UI.createLabel({
		text : "Boleto: " + boleto,
		left : '20',
		right : '20',
		"textAlign" : Ti.UI.TEXT_ALIGNMENT_CENTER,
		top : '5',
		color : "#004283",
		font : {
			fontSize : 20,
			fontFamily : 'FontAwesome'
		},
	});
	$.vistaListaBoletos.add(label);
});
