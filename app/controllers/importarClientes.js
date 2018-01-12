// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;



$.importarTodos.addEventListener('click', function(error) {
	var validacion = Alloy.createController("misClientes");
	validacion = validacion.getView();
	validacion.open();
});