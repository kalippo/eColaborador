// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;




$.entrar.addEventListener('click',function(error){
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
	
});

$.noSoyYo.addEventListener('click',function(error){
	var validacion = Alloy.createController("noSoyYo");
	validacion = validacion.getView();
	validacion.open();
	
});




