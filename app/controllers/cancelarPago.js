// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

var pagos = [{
	idTransaccion : '2628',
	idUsuario : '4741',
	monto : '1',
	descripcion : 'algo1'
}, {
	idTransaccion : '2629',
	idUsuario : '4741',
	monto : '11',
	descripcion : 'algo11'
}, {
	idTransaccion : '2630',
	idUsuario : '4741',
	monto : '111',
	descripcion : 'algo111'
}, {
	idTransaccion : '2632',
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

	var PagosDelDia = [];
	pagos.forEach(function pago() {
		PagosDelDia.push({
			descripcion : {
				text : pago.descripcion
			},
			monto : {
				text : pago.monto
			}
		});
	});
}
