// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
actualizaDatosColaborador();

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

$.cerrarSesion.addEventListener('click', function(error) {
	Alloy.Globals.Logout();
	actualizaDatosColaborador();
	alert('te has deslogeado correctamente');

});

function actualizaDatosColaborador() {
	if(Alloy.Globals.colaborador == '') {
		$.nombreColaborador.text = ' ';
		$.correoColaborador.text = '';
	} else {
		$.nombreColaborador.text = Alloy.Globals.colaborador.first_name;
		$.correoColaborador.text = Alloy.Globals.colaborador.email;
	}
}


//$.nombreColaborador.text = Alloy.Globals.colaborador.first_name;
//$.correoColaborador.text = Alloy.Globals.colaborador.email;
//$.telefonoColaborador.text = Alloy.Globals.colaborador.custom_fields.telefono;
