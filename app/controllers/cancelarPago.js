// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

var pagos = [{
	idTransaccion : '175928',
	idUsuario : '4741',
	monto : '1',
	descripcion : 'algo1'
}, {
	idTransaccion : '175929',
	idUsuario : '4741',
	monto : '11',
	descripcion : 'algo11'
}, {
	idTransaccion : '175930',
	idUsuario : '4741',
	monto : '111',
	descripcion : 'algo111'
}, {
	idTransaccion : '175931',
	idUsuario : '4741',
	monto : '1111',
	descripcion : 'algo1111'
}];


Ti.API.info('Pagos:' + JSON.stringify(pagos, null, 4));

cargarPagos();

if(Alloy.Globals.isiPhoneX() == true) {
	$.vistaTitulo.top = Alloy.Globals.margenNotch;
} else {

	$.vistaTitulo.top = "0";
}

$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController("pagoEnLinea");
	inicio = inicio.getView();
	inicio.open();
});

function cargarPagos() {

	var listapagos = [];
	pagos.forEach(function (pago) {
		listapagos.push({
			descripcion : {
				text : pago.descripcion
			},
			monto : {
				text : pago.monto
			}
		});
	});
	         $.listaPagos.sections[0].setItems(listapagos);

	Ti.API.info('listapagos:' + JSON.stringify(listapagos, null, 4));

}
