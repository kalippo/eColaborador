// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

Ti.API.info(JSON.stringify(Alloy.Globals.estaLogeado, null, 4));

Alloy.Globals.WsObtenerEstadoCuentaColaborador(Alloy.Globals.colaborador.username);
Alloy.Globals.WsObtenerSaldoGlobalColaborador(Alloy.Globals.colaborador.username);

Ti.API.info('saldo global' + JSON.stringify(Alloy.Globals.saldoGlobal, null, 4));
Ti.API.info('saldos' + JSON.stringify(Alloy.Globals.saldos, null, 4));

$.saldo.text = String.formatCurrency(parseInt(Alloy.Globals.saldoGlobal.saldoGlobal));
$.puntos.text = Alloy.Globals.saldoGlobal.puntos;

var sorteosSaldos = [];
Alloy.Globals.saldos.forEach(function(saldo) {

	//(idColaborador, tipoSorteo, numeroSorteo)
	//Alloy.Globals.WsObtenerBoletosColaboradorPorSorteo(Alloy.Globals.colaborador.username,
	// saldo.numeroJuego, saldo.idProducto);
	//Ti.API.info('cantidadBoletos' +
	// JSON.stringify(Alloy.Globals.boletosColaborador, null, 4));

	sorteosSaldos.push(Ti.UI.createPickerRow({
		title : saldo.nombreJuego,
		saldo : saldo.saldo,
		monto : saldo.monto,
		tipoSorteo : saldo.idProducto,
		numeroJuego : saldo.numeroJuego
	}));

});
$.sorteosSaldo.add(sorteosSaldos);

$.regresar.addEventListener('click', function(error) {	
	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();
});  

$.sorteosSaldo.addEventListener('change', function(e) {   
Ti.API.info('cambio:' +JSON.stringify(e, null, 4));
	try {
		Alloy.Globals.WsObtenerBoletosColaboradorPorSorteo(Alloy.Globals.colaborador.username, e.row.tipoSorteo, e.row.numeroJuego);
		
		setTimeout(function(){
		Ti.API.info('cantidadBoletos' +JSON.stringify(Alloy.Globals.boletosColaborador.length, null, 4));
		var cantidadBoletos = Alloy.Globals.boletosColaborador.length;
		
		
		$.saldoTotal.text = String.formatCurrency(parseInt(e.row.saldo)); 
		$.pagosTotal.text = String.formatCurrency(parseInt(e.row.monto));
		$.boletosTotal.text = cantidadBoletos;
		},100);


		

	} catch(err) {
	}  

});


$.sorteosSaldo.setSelectedRow(0,0);