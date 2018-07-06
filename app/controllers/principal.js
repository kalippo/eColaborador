// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
var sorteoCuentaRegresiva;
var hayMenu = false;
cuentaRegresivaVisible();
muestraMenu();
Alloy.Collections.menuPrincipal.comparator = function(model) {
	return model.get('indice');
};
//$.etiquetaSorteo.text = 'trololololo lolo lo lolo lo';
//Alloy.Globals.leerCuentaRegresiva();
//obtenerImagenes();
var timerSorteoActivo = setInterval(function() {
	//Ti.API.info('timerSorteo: ');
	try {
		sorteoCuentaRegresiva = Alloy.Collections.sorteosActivos.where({
			id : Alloy.Globals.idSorteoCuentaRegresiva
		});
		if(sorteoCuentaRegresiva.length > 0) {
			//Ti.API.info('destino: ' +
			// JSON.stringify(sorteoCuentaRegresiva[0].get('nombreSorteo'), null, 4));
			//Ti.API.info('total: ' + JSON.stringify(sorteoCuentaRegresiva.length, null, 4));
			//Ti.API.info('kill timerSorteo: ');
			clearInterval(timerSorteoActivo);
			cuentaRegresiva();
			cuentaRegresivaVisible();   

		}
	} catch(err) {
		Ti.API.info('timerSorteo error:' + err);
	}

}, 3000);

setTimeout(matarTimers, 8000);

var timerMenuPrincipal = setInterval(muestraMenu, 3000);

function matarTimers() {
	Ti.API.info('matarTimers: ');
	clearInterval(timerSorteoActivo);
	clearInterval(timerMenuPrincipal);
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

			Ti.API.info('kill timerMenu: ');
			clearInterval(timerMenuPrincipal);
		}
	} catch (err) {
	}
}


function crearMenuOpciones(menuActivo) {
	$.vistaPanel.removeAllChildren();
	//if($.vistaPanel.children.lenght == 0) {
	menuActivo.sort().forEach(function(opcion) {
		//Ti.API.info('opcion: ' + JSON.stringify(opcion, null, 4));
		var menu = Titanium.UI.createImageView({
			image : opcion.get('original'),
			id : opcion.get('pantalla'),
			top : '5',
			left : '0',
			right : '0',
			pantallaDestino : opcion.get('pantalla'),
			necesitaLogin : opcion.get('necesitaLogin'),
		});
		menu.addEventListener('click', clickMenu);

		var anchoPantalla = Ti.Platform.displayCaps.platformWidth;

		if(Ti.Platform.osname == 'android') {
			anchoPantalla = pixelToDp(anchoPantalla);
		}
		menu.width = anchoPantalla;
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
		matarTimers();
		validacion.open();
	} else if(this.necesitaLogin == 1 && Alloy.Globals.estaLogeado == false) {
		var validacion = Alloy.createController('login');
		validacion = validacion.getView();
		matarTimers();
		validacion.open();
	}
}


$.iconoCalendario.addEventListener('click', abreCalendario);
$.lblCalendario.addEventListener('click', abreCalendario);

function abreCalendario() {
	var validacion = Alloy.createController('calendario');
	validacion = validacion.getView();
	validacion.open();
}


var timerContador = setInterval(cuentaRegresiva, 1000);

function cuentaRegresivaVisible() {
	if(Alloy.Globals.idSorteoCuentaRegresiva != 0) {
		cuentaRegresiva();
		$.vistaCuentaRegresiva.visible = true;
		$.vistaCuentaRegresiva.height = 120;
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
		var contador = new Date(resta);
		var dias = (contador.getUTCDate() - 1).toString();
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

