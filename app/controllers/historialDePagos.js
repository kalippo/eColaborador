// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

if(Alloy.Globals.isiPhoneX()==true) {
	$.vistaTitulo.top = Alloy.Globals.margenNotch;
} else {

	$.vistaTitulo.top = "0"; 
}

Alloy.Globals.contactos.forEach(function(contacto) {
	if(contacto.id == args) {
		detalle = contacto;
	}
});

var pagos = detalle.abonos;
var listaPagos =[];
pagos.forEach(function(pago) {
	Ti.API.info('pago:' + JSON.stringify(pago, null, 4));
	var cantidad = String.formatCurrency(parseInt(pago.cantidad));
	//var fecha = Date(pago.fecha);
	listaPagos.push({
		cantidad: {text:cantidad},
		fecha: {text: pago.fecha }
	});
	
});
$.listaHistorial.sections[0].setItems(listaPagos);

$.regresar.addEventListener('click',function(){
	var inicio = Alloy.createController("detalleCliente", args);
	inicio = inicio.getView();
	inicio.open();
});
