

$.imagenMisClientes.addEventListener('click',function(error){
	var validacion = Alloy.createController("misClientes");
	validacion = validacion.getView();
	validacion.open();
	
});

$.imagenSorteosHerramientas.addEventListener('click',function(error){
	var validacion = Alloy.createController("login");
	validacion = validacion.getView();
	validacion.open();
	
});

$.index.open();
