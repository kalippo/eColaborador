// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

var notificaciones = Alloy.Globals.notificaciones;

Ti.API.info(JSON.stringify(Alloy.Globals.notificaciones, null, 4));

cargaNotificaciones();

function cargaNotificaciones() {
	var lista = [];
	if(notificaciones.length == 0) {
		lista.push({
			titulo : {
				text : 'sin notificaciones'
			},
			detalle : {
				text : ' ',
				height : '30'
			},
			notificacion : {
				tipo : 'vacia'
			},

		});
	}
	notificaciones.forEach(function(notificacion) {
		lista.push({
			titulo : {
				text : notificacion.titulo
			},
			detalle : {
				text : notificacion.detalle,
				height : '30'
			},
			notificacion : notificacion,

		});
	});
	$.listaNotificaciones.sections[0].setItems(lista);
}


$.regresar.addEventListener('click', function(error) {
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
});

$.listaNotificaciones.addEventListener('itemclick', function(e) {

	var row = $.listaNotificaciones.sections[0].getItemAt(e.itemIndex);
	Ti.API.info(JSON.stringify(row.notificacion.tipo, null, 4));
	if(row.notificacion.tipo != 'vacia') {
		var validacion = Alloy.createController(row.notificacion.tipo, row.notificacion);
		validacion = validacion.getView();
		validacion.open();
	}
}); 