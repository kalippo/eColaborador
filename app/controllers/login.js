// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


$.iniciarSesion.addEventListener('click', function(error) {


	var validacion = Alloy.createController("validacionLogin");
	validacion = validacion.getView();
	validacion.open();

});


