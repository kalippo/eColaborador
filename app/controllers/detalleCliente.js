// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


$.regresar.addEventListener('click', function(error) {

	var inicio = Alloy.createController("misClientes");
	inicio = inicio.getView();
	inicio.open();

});