// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


$.miPerfil.addEventListener('click', function(error) {

	var validacion = Alloy.createController("perfilColaborador");
	validacion = validacion.getView();
	validacion.open();
});