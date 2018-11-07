// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;     
setTimeout(actualizaDatosColaborador, 3000);
actualizaDatosColaborador();
$.vistaMiPerfil.addEventListener('click', function(error) {
	if(Alloy.Globals.estaLogeado) {
		var validacion = Alloy.createController("perfilColaborador");
	} else {
		var validacion = Alloy.createController("login");
	}
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
$.permisosGobernacion.addEventListener('click', function(error) {
	var validacion = Alloy.createController("permisoGobernacion");
	validacion = validacion.getView();
	validacion.open();
});

$.notificaciones.addEventListener('click', function(error) {
	var validacion = Alloy.createController("notificaciones");
	validacion = validacion.getView();
	validacion.open();
});


$.cerrarSesion.addEventListener('click', function(error) {
	if(Alloy.Globals.estaLogeado) {
		Alloy.Globals.Logout();
		actualizaDatosColaborador();
		Alloy.Globals.unsubscribeToChannel();
		//alert('Haz cerrado la sesión correctamente');
		var dialog = Ti.UI.createAlertDialog({

			buttonNames : ['Ok'],
			message : 'Haz cerrado la sesión correctamente',
			title : 'Cerrar sesión'
		});
		dialog.show();
		$.cerrarSesion.text = "Iniciar Sesión";

	} else {
		var validacion = Alloy.createController("login");
		validacion = validacion.getView();
		validacion.open();
	}

});

function actualizaDatosColaborador() {
	if(Alloy.Globals.colaborador == '') {
		$.nombreColaborador.text = ' ';
		$.correoColaborador.text = '';
	} else {
		$.nombreColaborador.text = Alloy.Globals.colaborador.first_name;
		//$.correoColaborador.text = Alloy.Globals.colaborador.email;
		Ti.API.log(JSON.stringify(Alloy.Globals.colaborador, null, 4));
		Ti.API.log(Alloy.Globals.colaborador.username + '@sorteostec.mx');
		Ti.API.log(Alloy.Globals.colaborador.email);
		if(Alloy.Globals.colaborador.username + '@sorteostec.mx' == Alloy.Globals.colaborador.email) {
			$.correoColaborador.text = '';
		} else {
			$.correoColaborador.text = Alloy.Globals.colaborador.email;
		}
	}
	if(Alloy.Globals.estaLogeado) {
		$.cerrarSesion.text = "Cerrar Sesión";
	} else {
		$.cerrarSesion.text = "Iniciar Sesión";
	}
}


//$.nombreColaborador.text = Alloy.Globals.colaborador.first_name;
//$.correoColaborador.text = Alloy.Globals.colaborador.email;
//$.telefonoColaborador.text = Alloy.Globals.colaborador.custom_fields.telefono;
