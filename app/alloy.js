Ti.API.info('test');

Alloy.Globals.Cloud = require('ti.cloud');

//Alloy.Globals.contactos = Ti.App.Properties.getList('listaContactos', []);

Alloy.Globals.maxId = Ti.App.Properties.getInt('maxId', 1);
var log = Ti.App.Properties.getString('password', '');
var pass = Ti.App.Properties.getString('login', '');

var collectionMenuPrincipal = Backbone.Collection.extend();
var menuPrincipal = new collectionMenuPrincipal();
Alloy.Collections.menuPrincipal = menuPrincipal;

var collectionSorteosActivos = Backbone.Collection.extend();
var sorteosActivos = new collectionSorteosActivos();
Alloy.Collections.sorteosActivos = sorteosActivos;

var collectionColaboradorActivos = Backbone.Collection.extend();
var colaborador = new collectionColaboradorActivos();
Alloy.Collections.colaborador = colaborador;

var collectionCompradores = Backbone.Collection.extend();
var compradores = new collectionCompradores();
Alloy.Collections.compradores = compradores;

// GLOBALES

Alloy.Globals.imagenCalendario = '';

//inicializar variables globales
Alloy.Globals.reinicioVariables = function() {
	Alloy.Globals.estaLogeado = false;
	Alloy.Globals.contactos = [];
	Alloy.Globals.compradores = [];
	Alloy.Globals.boletosColaborador = [];
	Alloy.Globals.idSorteoCuentaRegresiva = 0;
	Alloy.Globals.fechaSorteoCuentaRegresiva = 0;
	Alloy.Globals.colaborador = '';

};

//Obtener llaves globales
Alloy.Globals.leerCuentaRegresiva = function() {
	Alloy.Globals.Cloud.KeyValues.get({
		name : 'idsorteocuentaregresiva'
	}, function(e) {
		if(e.success) {
			var idSorteo = e.keyvalues[0];
			if(idSorteo > 0) {
				Alloy.Globals.Cloud.KeyValues.get({
					name : 'fechacuentaregresiva'
				}, function(e) {
					if(e.success) {
						var fecha = e.keyvalues[0];

						Alloy.Globals.idSorteoCuentaRegresiva = idSorteo;
						Alloy.Globals.fechaSorteoCuentaRegresiva = fecha;

					}
				});
			}
		}
	});
	Ti.API.info('idSorteoCuentaRegresiva:' + Alloy.Globals.idSorteoCuentaRegresiva + '\nfechaSorteoCuentaRegresiva:' + Alloy.Globals.fechaSorteoCuentaRegresiva);

};

//SERVICIOS

Alloy.Globals.WsObtenerSorteos = function() {

	Ti.API.info('prueba ObtenerSorteos: ');
	var data = [];
	var theURL = 'http://10.97.129.14/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc';
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\n    <x:Header/>\n    <x:Body>\n        <tem:ObtenerSorteos></tem:ObtenerSorteos>\n    </x:Body>\n</x:Envelope>";
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;
	xhr.onload = function() {
		// Assuming that you have a valid json response
		//Ti.API.info('ws: ');
		//Ti.API.info('responde: \n '+JSON.stringify(this.responseText, null, 4));
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerSorteosResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlSorteos = XMLObject.getElementsByTagName("SORTEO");
		//Ti.API.info('xml:\n'+JSON.stringify(xmlSorteos.length, null, 4));
		var sorteos = [];
		Alloy.Collections.sorteosActivos.reset();
		for( i = 0; i < xmlSorteos.length; i++) {
			var IdSorteo = xmlSorteos.item(i).getElementsByTagName("idSorteo").item(0).textContent;
			var Descripcion = xmlSorteos.item(i).getElementsByTagName("descripcion").item(0).textContent;
			var TipoSorteo = xmlSorteos.item(i).getElementsByTagName("tipoSorteo").item(0).textContent;
			var NumeroSorteo = xmlSorteos.item(i).getElementsByTagName("numeroSorteo").item(0).textContent;
			var FechaInicio = xmlSorteos.item(i).getElementsByTagName("fechaInicio").item(0).textContent;
			var FechaFin = xmlSorteos.item(i).getElementsByTagName("fechaFin").item(0).textContent;
			var FechaFiniquito = xmlSorteos.item(i).getElementsByTagName("fechaFiniquito").item(0).textContent;
			var PrecioUnitario = xmlSorteos.item(i).getElementsByTagName("precioUnitario").item(0).textContent;
			var Emision = xmlSorteos.item(i).getElementsByTagName("emision").item(0).textContent;
			var EnVenta = xmlSorteos.item(i).getElementsByTagName("enVenta").item(0).textContent;
			//Ti.API.info(id);

			var sorteo = Alloy.createModel('modeloSorteo', {
				id : IdSorteo,
				nombreSorteo : Descripcion,
				activo : 0,
				tipoSorteo : TipoSorteo,
				numeroSorteo : NumeroSorteo,
				fechaInicio : FechaInicio,
				fechaFin : FechaFin,
				fechaFiniquito : FechaFiniquito,
				precioUnitario : PrecioUnitario,
				mision : Emision,
				original : '',
				miniatura : '',

			});
			sorteo.save();
			Alloy.Collections.sorteosActivos.push(sorteo);
		}
		asignarImagenesSorteo();
		//Ti.API.info(JSON.stringify(sorteos, null, 4));
		//Ti.API.info('sorteosActivos:\n' +
		// JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));
	};
	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("error");
		return;

	};
	xhr.open("POST", "http://10.97.129.14/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc");

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerSorteos");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "983da4bd-5d13-4c54-84d9-a500527f55aa");
	xhr.send(body);

};

Alloy.Globals.WsObtenerClientesColaborador = function(idColaborador) {

	Ti.API.info('prueba ObtenerClientesColaborador: ');
	var data = [];
	// @formatter:off
	var xmlParametros = "<![CDATA["
						+"<raiz> "
						+"<idColaborador>" + idColaborador.toString() + "</idColaborador>"
						+"</raiz>"
					+"]]>";
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
			+"<x:Header/>"
			+"<x:Body>"
			+"<tem:ObtenerClientesColaborador>"
			+"     <tem:xml>" + xmlParametros + "</tem:xml>"
			+"</tem:ObtenerClientesColaborador>"
			+"</x:Body>\n</x:Envelope>";
	// @formatter:on
	var theURL = 'http://10.97.129.14/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc';
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;
	xhr.onload = function() {
		//Ti.API.info(this.responseText);
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerClientesColaboradorResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlCompradores = XMLObject.getElementsByTagName("nombres");
		//Ti.API.info('xml:\n' + JSON.stringify(xmlCompradores, null, 4));
		//Ti.API.info(xmlCompradores.length);
		compradores = [];
		for( i = 0; i < xmlCompradores.length; i++) {
			//var nombre =
			var comprador = xmlCompradores.item(i).getElementsByTagName("nombre").item(0).textContent;
			var telefono = xmlCompradores.item(i).getElementsByTagName("telefono").item(0).textContent;
			//Ti.API.info('nombre:' +
			// JSON.stringify(xmlCompradores.item(i).getElementsByTagName("nombre").item(0).textContent,
			// null, 4));
			//Ti.API.info('telefono:' +
			// JSON.stringify(xmlCompradores.item(i).getElementsByTagName("telefono").item(0).textContent,
			// null, 4));
			compradores.push({
				nombre : comprador,
				telefono : telefono
			});
		}
		//Ti.API.info('compradores:\n' + JSON.stringify(compradores, null, 4));
		Alloy.Globals.compradores = compradores;
	};
	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("error");
		Ti.API.info(JSON.stringify(e, null, 4));

		return;

	};
	xhr.open("POST", theURL);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerClientesColaborador");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.send(body);

};

Alloy.Globals.WsObtenerBoletosColaboradorPorSorteo = function(idColaborador, tipoSorteo, numeroSorteo) {

	Ti.API.info('prueba ObtenerBoletosColaboradorPorSorteo : ');
	var data = [];

	// @formatter:off
	var xmlParametros = "<![CDATA[" 
				+ " <raiz> "
					+"<numeroSorteo>" + numeroSorteo.toString() + "</numeroSorteo>" 
					+ "<tipoSorteo>" + tipoSorteo.toString() + "</tipoSorteo> " 
					+ "<idColaborador>" + idColaborador.toString() + "</idColaborador>" 
				+ "</raiz>"
			+ " ]]>";
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
			+"<x:Header/>"
			+"<x:Body>"
			+"<tem:ObtenerBoletosColaboradorPorSorteo>"
			+"     <tem:xml>" + xmlParametros + "</tem:xml>"
			+"</tem:ObtenerBoletosColaboradorPorSorteo>"
			+"</x:Body>\n</x:Envelope>";
	// @formatter:on

	var theURL = 'http://10.97.129.14/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc';
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;

	xhr.onload = function() {
		//Ti.API.info(this.responseText);
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerBoletosColaboradorPorSorteoResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlBoletos = XMLObject.getElementsByTagName("numeroBoleto");
		//Ti.API.info('xml:\n' + JSON.stringify(xmlBoletos.length, null, 4));

		boletosColaborador = [];
		for( i = 0; i < xmlBoletos.length; i++) {
			//var nombre =
			var numeroBoleto = xmlBoletos.item(i).textContent;
			boletosColaborador.push({
				boleto : numeroBoleto
			});
		}
		//Ti.API.info('boletos:\n' + JSON.stringify(boletosColaborador, null, 4));
		Alloy.Globals.boletosColaborador = boletosColaborador;
	};

	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
		Ti.API.info(JSON.stringify(e, null, 4));

		return;

	};

	xhr.open("POST", theURL);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerBoletosColaboradorPorSorteo");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.send(body);

};

Alloy.Globals.WsObtenerObsequiosColaborador = function(idColaborador, idSorteo, numeroBoleto) {

	Ti.API.info('prueba ObtenerObsequiosColaborador  : ');
	var data = [];

	// @formatter:off
	var xmlParametros = "<![CDATA[" 
				+ " <raiz> "
					+"<idColaborador>" + idColaborador.toString() + "</idColaborador>" 
					+ "<idSorteo>" + idSorteo.toString() + "</idSorteo> " 
					+ "<numeroBoleto>" + numeroBoleto.toString() + "</numeroBoleto>" 
				+ "</raiz>"
			+ " ]]>";
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
			+"<x:Header/>"
			+"<x:Body>"
			+"<tem:ObtenerObsequiosColaborador >"
			+"     <tem:xml>" + xmlParametros + "</tem:xml>"
			+"</tem:ObtenerObsequiosColaborador >"
			+"</x:Body>\n</x:Envelope>";
	// @formatter:on

	var theURL = 'http://10.97.129.14/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc';
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;

	xhr.onload = function() {
		//Ti.API.info(this.responseText);
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerObsequiosColaboradorResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlObsequios = XMLObject.getElementsByTagName("obsequio");
		//Ti.API.info('xml:\n' + JSON.stringify(xmlObsequios.length, null, 4));

		obsequios = [];
		for( i = 0; i < xmlObsequios.length; i++) {
			//var nombre =
			var sorteo = xmlObsequios.item(i).getElementsByTagName("sorteo").item(0).textContent;
			var idSorteo = xmlObsequios.item(i).getElementsByTagName("idSorteo").item(0).textContent;
			var descripcionPremio = xmlObsequios.item(i).getElementsByTagName("descripcionPremio").item(0).textContent;
			var numeroBoleto = xmlObsequios.item(i).getElementsByTagName("numeroBoleto").item(0).textContent;
			obsequios.push({
				sorteo : sorteo,
				idSorteo : idSorteo,
				descripcionPremio : descripcionPremio,
				numeroBoleto : numeroBoleto
			});
		}
		//Ti.API.info('ObtenerObsequiosColaborador:\n' + JSON.stringify(obsequios, null,
		// 4));
		Alloy.Globals.obsequios = obsequios;
	};

	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
		Ti.API.info(JSON.stringify(e, null, 4));

		return;

	};

	xhr.open("POST", theURL);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerObsequiosColaborador ");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.send(body);

};

Alloy.Globals.login = function(loginColaborador, passwordColaborador) {
	Ti.API.info('login:' + loginColaborador + ' password:' + passwordColaborador);
	if(loginColaborador != '' && passwordColaborador != '') {
		Alloy.Globals.Cloud.Users.login({
			login : loginColaborador,
			password : passwordColaborador
		}, function(e) {
			if(e.success) {
				Alloy.Globals.estaLogeado = true;
				Alloy.Globals.Cloud.Users.showMe(function(e) {
					if(e.success) {

						var user = e.users[0];
						Ti.App.Properties.setString('login', user.username);
						Ti.App.Properties.setString('password', passwordColaborador);
						Alloy.Globals.colaborador = user;
						Alloy.Globals.contactos = JSON.parse(user.custom_fields.compradores);

					} else {
						Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});
			} else {
				var ACS = require('ti.cloud'),
				    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
				    username = Ti.App.Properties.getString('acs-username-' + env),
				    password = Ti.App.Properties.getString('acs-password-' + env);

				// if not configured, just return
				if(!env || !username || !password) {
					return;
				}
				/**
				 * Appcelerator Cloud (ACS) Admin User Login Logic
				 *
				 * fires login.success with the user as argument on success
				 * fires login.failed with the result as argument on error
				 */
				ACS.Users.login({
					login : username,
					password : password,
				}, function(result) {
					if(env === 'development') {
						Ti.API.info('ACS Login Results for environment `' + env + '`:');
						Ti.API.info(result);
					}
					if(result && result.success && result.users && result.users.length) {
						Ti.App.fireEvent('login.success', result.users[0], env);

					} else {
						Ti.App.fireEvent('login.failed', result, env);
					}
				});
			}
		});
	}
};

Alloy.Globals.Logout = function(){
	Alloy.Globals.reinicioVariables();
	Alloy.Globals.Cloud.Users.logout(function(e) {
		if(e.success) {
			Ti.App.Properties.setString('password', '');
			Ti.App.Properties.setString('login', '');
			
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
};


function leercalendario() {
	Alloy.Globals.Cloud.Photos.show({
		photo_id : '5b0dbed6fd2da951720008de'
	}, function(e) {
		if(e.success) {
			var photo = e.photos[0];
			Alloy.Globals.imagenCalendario = photo.urls.original;
			Ti.API.info(JSON.stringify(photo.urls.original, null, 4));
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}


//METODOS
function asignarImagenesSorteo() {

	Alloy.Globals.Cloud.PhotoCollections.showPhotos({
		collection_id : "5a6b839824ee48c54b8ecad7"
	}, function(e) {
		if(e.success) {
			if(!e.photos) {
				//agregar mensaje de que no hay sorteos activos
			} else {

				//Ti.API.info("fotos");
				e.photos.forEach(function(photo) {
					//Ti.API.info(JSON.stringify(photo.custom_fields.idSorteo, null, 4));
					var sorteosPorTipo = Alloy.Collections.sorteosActivos.where({
						tipoSorteo : photo.custom_fields.idSorteo.toString()
					});
					//Ti.API.info(JSON.stringify(sorteosPorTipo, null, 4));
					sorteosPorTipo.forEach(function(sorteo) {

						sorteo.set({
							original : photo.urls.original,
							miniatura : photo.urls.thumb_100,
							activo : 1
						});

					});
				});
				//Ti.API.info("SORTEOS ACTIVOS \n" +
				// JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));

			}
		} else {
			//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});

}


Alloy.Globals.guardarContactos = function() {
	Alloy.Globals.contactos.sort(function(a, b) {
		var keyA = a.nombreContacto,
		    keyB = b.nombreContacto;
		if(keyA < keyB)
			return -1;
		if(keyA > keyB)
			return 1;
		return 0;
	});

	Alloy.Globals.Cloud.Users.update({
		custom_fields : {
			compradores : JSON.stringify(Alloy.Globals.contactos)

		}
	}, function(e) {
		if(e.success) {
			Ti.API.info('Guardado');
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});

	Ti.API.info(JSON.stringify(Alloy.Globals.contactos, null, 4));
	Ti.App.Properties.setList('listaContactos', Alloy.Globals.contactos);
	Alloy.Globals.maxId = Alloy.Globals.maxId + 1;
	Ti.App.Properties.setInt('maxId', Alloy.Globals.maxId);
	Ti.API.info(Alloy.Globals.maxId);
};

Alloy.Globals.reinicioVariables();
Alloy.Globals.login(log, pass);
Alloy.Globals.WsObtenerSorteos();
Alloy.Globals.WsObtenerClientesColaborador(1662196);
Alloy.Globals.WsObtenerBoletosColaboradorPorSorteo(1662196, 4, 11);
Alloy.Globals.WsObtenerObsequiosColaborador(821400, 61277, 22675);
leercalendario();

//buscaPalabras('Pedro Pablo Miramontes Valencia');

function buscaPalabras(cadena) {
	var sinEspacios = cadena.trim();
	var longitud = sinEspacios.length;
	var espacio = sinEspacios.indexOf(' ');
	Ti.API.info('string:' + sinEspacios);
	Ti.API.info('longitud:' + longitud);
	Ti.API.info('espacio:' + espacio);
	if(espacio > 0) {
		llenaDeAsteriscos(sinEspacios.substr(0,espacio));
		buscaPalabras(sinEspacios.substr(espacio,longitud));

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
	//return nombreOculto;
};

