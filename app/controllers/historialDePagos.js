// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

Alloy.Globals.contactos.forEach(function(contacto) {
	if(contacto.id == args) {
		detalle = contacto;
	}
});

var pagos = detalle.abonos;
var listaPagos =[];
pagos.forEach(function(pago) {
	Ti.API.info('pago:' + JSON.stringify(pago, null, 4));
	//var fecha = Date(pago.fecha);
	listaPagos.push({
		cantidad: {text:pago.cantidad},
		fecha: {text: pago.fecha }
	});
	
});
$.listaHistorial.sections[0].setItems(listaPagos);

$.regresar.addEventListener('click',function(){
	var inicio = Alloy.createController("detalleCliente", args);
	inicio = inicio.getView();
	inicio.open();
});
