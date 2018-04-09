// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

abreLogin();
Ti.API.info(JSON.stringify(Alloy.Globals.estaLogeado,null,4));


function abreLogin(){
	var validacion = Alloy.createController("login");
	validacion = validacion.getView();
	validacion.open();
}
