// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


$.vistaMiPerfil.addEventListener('click', function(error) {

	var validacion = Alloy.createController("perfilColaborador");
	validacion = validacion.getView();
	validacion.open();
});