// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


$.listaCOntactos.addEventListener('itemclick',function(error){
	
	
	var validacion = Alloy.createController("detalleCliente");
	validacion = validacion.getView();
	validacion.open();
	
});
