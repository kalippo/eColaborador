// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.regresar.addEventListener('click',function(error){
	Alloy.Globals.Logout();
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
	
});