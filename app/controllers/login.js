// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
Ti.API.info(JSON.stringify(Alloy.Globals.estaLogeado, null, 4));
$.iniciarSesion.addEventListener('click', function(error) {
	if($.claveColaborador.value.trim() == '' || $.password.value.trim() == '') {
		alert('favor de llenar todos los campos');
	} else {
		Alloy.Globals.login($.claveColaborador.value, $.password.value);
		setTimeout(function() {
			if(Alloy.Globals.estaLogeado) {
			var validacion = Alloy.createController("validacionLogin");
			validacion = validacion.getView();
			validacion.open();
		} else {
			alert('Clave decolaborador o password incorrectos');
			$.password.value = '';
		}
		}, 2500);
		
	}

});

