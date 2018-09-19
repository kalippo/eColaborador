// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

Ti.API.info('msg: ' + JSON.stringify(args, null, 4));
$.titulo.text = args.titulo;
$.mensaje.text = args.detalle;

$.regresar.addEventListener('click', function(error) {
	var validacion = Alloy.createController("notificaciones");
	validacion = validacion.getView();
	validacion.open();
});