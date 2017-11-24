// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.imagenMisClientes.addEventListener('click', function(error) {

	var validacion = Alloy.createController("misClientes");
	validacion = validacion.getView();
	validacion.open();
});

$.iconoMenu.addEventListener('click', function(error) {

	$.navDrawer.toggleMenu();
	Ti.API.info($.navDrawer,null,3);
	

});

$.imagenSorteosHerramientas.addEventListener('click', function(error) {
	var validacion = Alloy.createController("login");
	validacion = validacion.getView();
	validacion.open();
});



