// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

habilitaEntrar();

$.entrar.addEventListener('click', function(error) {
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();

});

$.noSoyYo.addEventListener('click', function(error) {
	var validacion = Alloy.createController("noSoyYo");
	validacion = validacion.getView();
	validacion.open();

});

$.nombreColaborador.text = '';
$.terminos.addEventListener('change', habilitaEntrar);
$.aviso.addEventListener('change', habilitaEntrar);

buscaPalabras(Alloy.Globals.colaborador.first_name);
// + ' ' + Alloy.Globals.colaborador.last_name);
function habilitaEntrar(error) {

	$.entrar.enabled = ($.terminos.value && $.aviso.value);
	if($.entrar.enabled) {
		$.entrar.opacity = 1;
	} else {
		$.entrar.opacity = .5;
	}

};

function buscaPalabras(cadena) {
	var sinEspacios = cadena.trim();
	var longitud = sinEspacios.length;
	var espacio = sinEspacios.indexOf(' ');
	Ti.API.info('string:' + sinEspacios);
	Ti.API.info('longitud:' + longitud);
	Ti.API.info('espacio:' + espacio);
	if(espacio > 0) {
		llenaDeAsteriscos(sinEspacios.substr(0, espacio));
		buscaPalabras(sinEspacios.substr(espacio, longitud));

	} else {
		llenaDeAsteriscos(sinEspacios);
	}

};

function llenaDeAsteriscos(cadena) {
	var longitud = cadena.length;

	//Ti.API.info(length(cadena));
	var inicial = cadena.substr(0, 1) + '*********************************';
	var nombreOculto = inicial.substr(0, longitud);
	//Ti.API.info(JSON.stringify(cadena.substr(0,1)) );
	Ti.API.info(nombreOculto);
	$.nombreColaborador.text = $.nombreColaborador.text + ' ' + nombreOculto;
	//return nombreOculto;
};