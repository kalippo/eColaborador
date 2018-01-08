// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


$.inicioSesion.addEventListener('click', function(error) {
	var validacion = Alloy.createController("login");
	validacion = validacion.getView();
	validacion.open();
});

$.cancelar.addEventListener('click',function(error){
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
	
});

$.vistaAbajo.addEventListener('click',function(error){
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
	
});

$.VistaArriba.addEventListener('click',function(error){
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
	
});