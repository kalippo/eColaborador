// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
Ti.API.info(JSON.stringify(Alloy.Globals.estaLogeado, null, 4));
$.iniciarSesion.addEventListener('click', function(error) {
	if($.claveColaborador.value.trim() == '' || $.password.value.trim() == '') {
		alert('favor de llenar todos los campos');
	} else {
		$.vistaProcesando.visible = true;
		$.procesando.show();
		Alloy.Globals.login($.claveColaborador.value, $.password.value, function() {
			if(Alloy.Globals.estaLogeado) {
				var validacion = Alloy.createController("validacionLogin");
				validacion = validacion.getView();
				validacion.open();
			} else {
				alert('Clave decolaborador o password incorrectos');
				$.password.value = '';
			}
			$.procesando.hide();
			$.vistaProcesando.visible = false;
		});

	}

});

$.cancelar.addEventListener('click', function() {
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
});

$.continuaInvitado.addEventListener('click', function() {
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
});

$.sorteosTec.addEventListener('click', function() {
	var validacion = Alloy.createController("calendario");
	validacion = validacion.getView();
	validacion.open();
}); 