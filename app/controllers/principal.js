// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
var sorteoCuentaRegresiva;
var hayMenu = false;
cuentaRegresivaVisible();

Alloy.Globals.obtenerImagenesMenuPrincipal(muestraMenu);
//alert(Alloy.Collections.sorteosActivos.length);
if(Alloy.Collections.sorteosActivos.length > 0) {
	//alert('sorteos:' + JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));
	cuentaRegresiva();

} else {
	$.vistaProcesando.visible = true;
	$.procesando.show();
	Alloy.Globals.WsObtenerSorteos(leerCuentaRegresiva);

}

Alloy.Collections.menuPrincipal.comparator = function(model) {
	return model.get('indice');
};
//$.etiquetaSorteo.text = 'trololololo lolo lo lolo lo';
//Alloy.Globals.leerCuentaRegresiva();
//obtenerImagenes();

//Ti.API.info('timerSorteo: ');

setTimeout(function() {
	$.vistaProcesando.visible = false;
	$.procesando.hide();
}, 5000);

function leerCuentaRegresiva() {
	// alert('cuenta:');
	Alloy.Globals.leerCuentaRegresiva(function() {
		try {
			sorteoCuentaRegresiva = Alloy.Collections.sorteosActivos.where({
				id : Alloy.Globals.idSorteoCuentaRegresiva
			});
			Ti.API.info('leerCuentaRegresiva: ' + JSON.stringify(sorteoCuentaRegresiva, null, 4));
			if(sorteoCuentaRegresiva.length > 0) {
				cuentaRegresivaVisible();
				cuentaRegresiva();

			}
			$.vistaProcesando.visible = false;
			$.procesando.hide();
		} catch(err) {
			Ti.API.info('timerSorteo error:' + err);
		}
	}, function() {
		$.vistaProcesando.visible = false;
		$.procesando.hide();
	});

}


function muestraMenu() {

	try {
		var menu = Alloy.Collections.menuPrincipal.where({
			activo : true
		});
		//Ti.API.info('menuPrincipal:' + JSON.stringify(Alloy.Collections.menuPrincipal,
		// null, 4));
		//Ti.API.info('muestraMenu:' + JSON.stringify(menu, null, 4));
		if(menu.length > 0) {

			crearMenuOpciones(menu);

		}
	} catch (err) {
	}
}


function crearMenuOpciones(menuActivo) {
	$.vistaPanel.removeAllChildren();
	if(Alloy.isTablet) {
		var margenIzquierdo = 70;
		var margenDerecho = 70;
	} else {
		var margenIzquierdo = 0;
		var margenDerecho = 0;

	}
	//if($.vistaPanel.children.lenght == 0) {
	menuActivo.sort().forEach(function(opcion) {
		//Ti.API.info('opcion: ' + JSON.stringify(opcion, null, 4));
		var menu = Titanium.UI.createImageView({
			image : opcion.get('original'),
			id : opcion.get('pantalla'),
			top : '2',
			left : margenIzquierdo,
			right : margenDerecho,
			pantallaDestino : opcion.get('pantalla'),
			necesitaLogin : opcion.get('necesitaLogin'),
		});
		menu.addEventListener('click', clickMenu);

		var anchoPantalla = Ti.Platform.displayCaps.platformWidth;

		if(Ti.Platform.osname == 'android') {
			anchoPantalla = pixelToDp(anchoPantalla);
		}
		menu.width = anchoPantalla-(margenDerecho+margenIzquierdo);
		menu.height = menu.width * .4;

		$.vistaPanel.add(menu);

		//Alloy.Globals.menusCargados = 1;
	});

	//}
	//}
}


// convert dp to pixel.
function dpToPixel(dp) {
	return (parseInt(dp) * (Titanium.Platform.displayCaps.dpi / 160));
}


// convert pixel to dp.
function pixelToDp(px) {
	return (parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}


$.iconoMenu.addEventListener('click', function() {

	Alloy.Globals.toggleMenu();
});

function clickMenu() {
	Ti.API.info('destino: ' + this.pantallaDestino);
	Ti.API.info('necesitaLogin: ' + JSON.stringify(this.necesitaLogin));
	Ti.API.info('estaLogeado: ' + JSON.stringify(Alloy.Globals.estaLogeado));

	if(this.pantallaDestino != 'blank' && (this.necesitaLogin == 0 || Alloy.Globals.estaLogeado == true)) {
		var validacion = Alloy.createController(this.pantallaDestino);
		validacion = validacion.getView();

		validacion.open();
	} else if(this.necesitaLogin == 1 && Alloy.Globals.estaLogeado == false) {
		var validacion = Alloy.createController('login');
		validacion = validacion.getView();

		validacion.open();
	}
}


$.iconoCalendario.addEventListener('click', abreCalendario);
$.lblCalendario.addEventListener('click', abreCalendario);
$.postales.addEventListener('click', function(){
	var validacion = Alloy.createController('pagoEnLinea');
	validacion = validacion.getView();
	validacion.open();
});

function abreCalendario() {
	var validacion = Alloy.createController('calendario');
	validacion = validacion.getView();
	validacion.open();
}


var timerContador = setInterval(cuentaRegresiva, 1000);

function cuentaRegresivaVisible() {
	if(Alloy.isTablet) {
		var tamañoCuentaRegresiva = 150;
	} else {
		var tamañoCuentaRegresiva = 85;

	}

	if(Alloy.Globals.idSorteoCuentaRegresiva != 0) {
		cuentaRegresiva();
		$.vistaCuentaRegresiva.visible = true;
		$.vistaCuentaRegresiva.height = tamañoCuentaRegresiva;
	} else {
		$.vistaCuentaRegresiva.visible = false;
		$.vistaCuentaRegresiva.height = 0;
	}
}


function cuentaRegresiva() {
	if(Alloy.Globals.idSorteoCuentaRegresiva != 0) {

		var fechaSorteo = Date.parse(Alloy.Globals.fechaSorteoCuentaRegresiva);
		var hoy = Date.now();
		resta = fechaSorteo - hoy;
		// Ti.API.info('fechaSorteo: ' + JSON.stringify(new Date(fechaSorteo), null, 4));
		// Ti.API.info('hoy: ' + JSON.stringify(new Date(hoy), null, 4));
		 // Ti.API.info('resta: ' + JSON.stringify(new Date(resta), null, 4));
		// Ti.API.info('resta: ' + JSON.stringify(resta, null, 4));
		var contador = new Date(resta);
		 // Ti.API.info('UTC Hora: ' + JSON.stringify(contador.getUTCMonth(), null, 4));
		var dias = (contador.getUTCMonth()*30 + contador.getUTCDate()).toString();
		var horas = (contador.getUTCHours()).toString();
		var minutos = (contador.getUTCMinutes()).toString();
		var segundos = (contador.getUTCSeconds()).toString();
		$.contadorDias.text = dias.toString();
		$.contadorHoras.text = horas.toString();
		$.contadorMinutos.text = minutos.toString();
		$.contadorSegundos.text = segundos.toString(); 
		var sorteoCuentaRegresiva = Alloy.Collections.sorteosActivos.where({
			id : Alloy.Globals.idSorteoCuentaRegresiva
		});
		try {
			var sorteoContador = sorteoCuentaRegresiva[0].get('nombreSorteo');
			$.etiquetaSorteo.text = sorteoContador;
		} catch(err) {
		}
	}

}


$.vistaPanel.addEventListener('swipe', function(e) {
	
	Ti.API.info('scroll: ' + JSON.stringify(e.direction, null, 4));
});

