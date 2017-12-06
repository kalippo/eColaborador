// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

habilitaEntrar();


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



$.terminos.addEventListener('change',habilitaEntrar);
$.aviso.addEventListener('change',habilitaEntrar);

 function habilitaEntrar(error){
	
	$.entrar.enabled = ($.terminos.value && $.aviso.value);
	$.entrar.opacity = $.entrar.enabled+.5;
	
};