// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

if(Alloy.Globals.isiPhoneX()==true) {
	$.vistaTitulo.top = Alloy.Globals.margenNotch;
} else {

	$.vistaTitulo.top = "0"; 
}

$.vistaProcesando.visible = true;
$.procesando.show();

Ti.API.info('estaLogeado' + JSON.stringify(Alloy.Globals.estaLogeado, null, 4));
Ti.API.info('username' + JSON.stringify(Alloy.Globals.colaborador.username, null, 4));

Alloy.Globals.WsObtenerSaldoGlobalColaborador(Alloy.Globals.colaborador.username, function() {
     Ti.API.info('saldo global' + JSON.stringify(Alloy.Globals.saldoGlobal, null, 4));

	$.saldo.text = Number.isInteger( Alloy.Globals.saldoGlobal.saldoGlobal) ?String.formatCurrency(parseInt(Alloy.Globals.saldoGlobal.saldoGlobal)):"$0.00";
	$.puntos.text = Alloy.Globals.saldoGlobal.puntos;
	$.actualizacion.text = 'Actualizado al '+ Alloy.Globals.saldoGlobal.fechaActualizacion;
});

Alloy.Globals.WsObtenerEstadoCuentaColaborador(Alloy.Globals.colaborador.username, function() {
	var sorteosSaldos = [];
	Alloy.Globals.saldos.forEach(function(saldo) {

		var colorTexto = 'black';
		if(Ti.Platform.osname == 'android') {
			$.vistaSeleccionSorteo.height = 50;
		} else {
			colorTexto = 'black';
			$.vistaSeleccionSorteo.height = 150;
		}
		sorteosSaldos.push(Ti.UI.createPickerRow({
			title : saldo.nombreJuego,
			saldo : saldo.saldo,
			monto : saldo.monto,
			tipoSorteo : saldo.idProducto,
			numeroJuego : saldo.numeroJuego,
			talones : saldo.talones,
			color : colorTexto,
			backgroundColor : "gray"
		}));

	});
	$.procesando.hide();
	$.vistaProcesando.visible = false;

	$.sorteosSaldo.add(sorteosSaldos);
	$.sorteosSaldo.setSelectedRow(0, 1);
	$.sorteosSaldo.setSelectedRow(0, 0);
}, function(e) {
	alert('No se puede obtener la informacion del estado de cuenta, \n favor de intentarlo más tarde');
	$.procesando.hide();
	$.vistaProcesando.visible = false;
});

$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();
});

$.sorteosSaldo.addEventListener('change', function(e) {
	//Ti.API.info('cambio:' + JSON.stringify(e, null, 4));
	Ti.API.info('user:' + Alloy.Globals.colaborador.username);
	Ti.API.info('tipo:' + e.row.tipoSorteo);
	Ti.API.info('numero:' + e.row.numeroJuego);
	$.vistaProcesando.visible = true;
	$.procesando.show();
	setTimeout(function() {

		Alloy.Globals.WsObtenerBoletosColaboradorPorSorteo(Alloy.Globals.colaborador.username, e.row.tipoSorteo, e.row.numeroJuego, function() {

			Ti.API.info('cantidadBoletos' + JSON.stringify(Alloy.Globals.boletosColaborador.length, null, 4));
			var cantidadBoletos = Alloy.Globals.boletosColaborador.length;

			$.saldoTotal.text = String.formatCurrency(parseInt(e.row.saldo));
			if($.saldoTotal.text == 'NaN') {
				$.saldoTotal.text = '$ 0';
			}
			if(e.row.monto == '0' || e.row.monto == '') {
				$.pagosTotal.text = '$ 0';

			} else {
				$.pagosTotal.text = e.row.monto.trim();
			}
			$.boletosTotal.text = cantidadBoletos;
			$.talonesTotal.text = e.row.talones.trim();

			$.procesando.hide();
			$.vistaProcesando.visible = false;

		}, function(e) {
			alert('No se puede obtener el detalle del estado de cuenta, \n favor de intentarlo más tarde');
			$.procesando.hide();
			$.vistaProcesando.visible = false;
		});

	}, 500);

});

