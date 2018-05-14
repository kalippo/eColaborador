// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.vistaMiPerfil.addEventListener('click', function(error) {
	var validacion = Alloy.createController("perfilColaborador");
	validacion = validacion.getView();
	validacion.open();
});

$.avisoPrivacidad.addEventListener('click', function(error) {
	var validacion = Alloy.createController("avisoPrivacidad");
	validacion = validacion.getView();
	validacion.open();
});

$.terminos.addEventListener('click', function(error) {
	var validacion = Alloy.createController("terminosCondiciones");
	validacion = validacion.getView();
	validacion.open();
});

$.notificaciones.addEventListener('click', function(error) {
	var validacion = Alloy.createController("notificaciones");
	validacion = validacion.getView();
	validacion.open();
}); 


$.nombreColaborador.text = Alloy.Globals.Datoscolaborador.nombre;
	$.correoColaborador.text = Alloy.Globals.Datoscolaborador.correo;
	//$.telefonoColaborador.text = Alloy.Globals.Datoscolaborador.telefono;
	

$.cerrarSesion.addEventListener('click', function(error) {
	Ti.App.Properties.setList('listaContactos', []);
	Alloy.Globals.contactos=[];
}); 