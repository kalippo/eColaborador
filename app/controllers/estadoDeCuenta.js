// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

 
Ti.API.info(JSON.stringify(Alloy.Globals.estaLogeado,null,4));



$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();
});  