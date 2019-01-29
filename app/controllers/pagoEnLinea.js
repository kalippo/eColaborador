// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Alloy.Globals.WsObtenerIdEmpleadoVenta(Alloy.Globals.colaborador.username, function () {
     Ti.API.info('EmpleadoVenta:\n'  + JSON.stringify(Alloy.Globals.EmpleadoVenta));
},function(){
     
});

if(Alloy.Globals.isiPhoneX()==true) {
	$.vistaTitulo.top = Alloy.Globals.margenNotch;
} else {

	$.vistaTitulo.top = "0"; 
}

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


