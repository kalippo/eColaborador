// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;



$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();
});  


$.botonGenerarPago.addEventListener('click', function(error) {
	var inicio = Alloy.createController("generarPagoEnLinea",null);
	inicio = inicio.getView();
	inicio.open();
});  
$.botonGenerarUrl.addEventListener('click', function(error) {
	var inicio = Alloy.createController("generarUrlPago");
	inicio = inicio.getView();
	inicio.open();
});  
$.botonCancelarPago.addEventListener('click', function(error) {
	var inicio = Alloy.createController("cancelarPago");
	inicio = inicio.getView();
	inicio.open();
});  


