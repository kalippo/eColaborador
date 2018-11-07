// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
var regresar = 'pagoEnLinea';
Ti.API.info(JSON.stringify(args, null, 4));

$.continuar.enabled = false;
llenaSorteos();

if(args.referencia >= 0) {
	$.continuar.title = 'Compartir';
	$.titulo.text = 'Generar Liga';
	regresar = 'generarUrlPago';

}

$.continuar.addEventListener('click', function() {
	if($.monto.value == '') {
		var dialog = Ti.UI.createAlertDialog({
			message : 'El monto a pagar no puede es	tar vacio',
			ok : 'Okay',
			title : 'Pago en línea'
		});
		dialog.show();

	} else {
		var param = '?idCliente=' + Alloy.Globals.colaborador.username + '&idSorteo=' + '1' + '%monto=' + $.monto.value.replace(/[^0-9.]+/g, '');
		Ti.API.info(param);

	}
});

$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController(regresar);
	inicio = inicio.getView();
	inicio.open();
});

$.monto.addEventListener('change', function(value) {
	if($.monto.value != '$.00') {
		var monto = $.monto.value.replace(/[^0-9.]+/g, '');
		Ti.API.info($.monto.value);
		Ti.API.info(monto);

		if(Alloy.Globals.esNumero(monto)) {
			monto = String.formatCurrency(parseInt(monto));

		}
		if(monto.length < 14) {

			Ti.API.info(monto);
			$.monto.value = monto.toString();
			value.source.setSelection(monto.length - 3, monto.length - 3);
			$.monto.anterior = monto;
		} else {
			value.source.setSelection($.monto.anterior.length - 3, $.monto.anterior.length - 3);
			$.monto.value = $.monto.anterior;
		}
	} else {
		Ti.API.info($.monto.value);
		$.monto.value = '';
	}

});

function llenaSorteos() {
	if(Ti.Platform.osname == 'android') {
		$.ListaSorteos.height = 50;
		$.vistaProcesando.height = 50;
		$.vistaProcesando.top = -50;

	} else {
		colorTexto = 'black';
		$.ListaSorteos.height = 150;
		$.vistaProcesando.height = 150;
		$.vistaProcesando.top = -150;
	}
	$.continuar.enabled = false;
	$.vistaProcesando.visible = true;
	$.procesando.show();
	// Ti.API.info('sorteos: \n' + JSON.stringify(Alloy.Collections.sorteosActivos,
	// null, 4));

	Alloy.Globals.WsObtenerEstadoCuentaColaborador(Alloy.Globals.colaborador.username, function() {
		var sorteos = [];
		Alloy.Globals.saldos.forEach(function(sorteo) {

			var colorTexto = 'black';

			sorteos.push(Ti.UI.createPickerRow({
				title : sorteo.nombreJuego,
				idSorteo : sorteo.idJuego,
				color : colorTexto,
				backgroundColor : "gray",
				left : "20",
				font : {
					fontWeight : 'bold',
					fontSize : '20'
				},
				alignItems : 'center',
				justifyContent : 'space-between',
			}));

		});
		// $.procesando.hide();
		// $.vistaProcesando.visible = false;

		$.ListaSorteos.add(sorteos);
		$.ListaSorteos.setSelectedRow(0, 1);
		$.ListaSorteos.setSelectedRow(0, 0);
		$.continuar.enabled = true;
		$.vistaProcesando.visible = false;
		$.procesando.hide();
	}, function(e) {
		alert('No se puede obtener la lista de sorteos, \n favor de intentarlo más tarde');
		$.vistaProcesando.visible = false;
		$.procesando.hide();
		// $.procesando.hide();
		// $.vistaProcesando.visible = false;
	});
}

