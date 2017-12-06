// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.imagenMisClientes.addEventListener('click', function(error) {

	var validacion = Alloy.createController("misClientes");
	validacion = validacion.getView();
	validacion.open();
});

$.vistaMenu.addEventListener('click', function(error) {

	Ti.API.info("nanana");
	Alloy.Globals.toggleMenu();
	

});

$.imagenEstadoCuenta.addEventListener('click', function(error) {
	var validacion = Alloy.createController("login");
	validacion = validacion.getView();
	validacion.open();
});

$.imagenSorteosHerramientas.addEventListener('click', function(error) {
	var validacion = Alloy.createController("sorteosHerramientas");
	validacion = validacion.getView();
	validacion.open();
});


