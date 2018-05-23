Ti.API.info('test');
Alloy.Globals.Cloud = require('ti.cloud');



//COLECCIONES
Alloy.Globals.maxId = Ti.App.Properties.getInt('maxId', 1);
var loginColaborador = Ti.App.Properties.getString('password', '');
var passwordColaborador = Ti.App.Properties.getString('login', '');

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

// TEST
//LOGIN
Alloy.Globals.estaLogeado = true;

Alloy.Globals.Datoscolaborador = {
	idColaborador : '123456',
	nombre : 'Colaborador Sorteos Tec',
	telefono : '1234567890',
	direccion : 'calle 1, numero 1234',
	correo : "colaborador@gmail.com"
};

// GLOBALES
Alloy.Globals.contactos = [];
Alloy.Globals.compradores = [];
Alloy.Globals.boletosColaborador = [];
Alloy.Globals.colaborador[];


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
		var xmlSorteos = XMLObject.getElementsByTagName("raiz");
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
				id : IdSorteo, // photo.custom_fields.activo,
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
		Ti.API.info(JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));
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
	var xmlParametros = "<![CDATA[<raiz> <idColaborador>" + idColaborador.toString() + "</idColaborador></raiz>]]>";
	var theURL = 'http://10.97.129.14/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc';
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\n    <x:Header/>\n    <x:Body>\n        <tem:ObtenerClientesColaborador>\n            <tem:xml>" + xmlParametros + "\n\t\t\t</tem:xml>\n        </tem:ObtenerClientesColaborador>\n    </x:Body>\n</x:Envelope>";
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
		Ti.API.info('compradores:\n' + JSON.stringify(compradores, null, 4));
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
						+ " < raiz > 
							+"<numeroSorteo>" + numeroSorteo.toString() + "</numeroSorteo>" 
							+ "<tipoSorteo>" + tipoSorteo.toString() + "</tipoSorteo> " 
							+ "<idColaborador>" + idColaborador.toString() + "</idColaborador>" 
						+ "</raiz>"
					+" ]]>";
	// @formatter:on
	var theURL = 'http://10.97.129.14/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc';
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\n    <x:Header/>\n    <x:Body>\n        <tem:ObtenerClientesColaborador>\n            <tem:xml>" + xmlParametros + "\n\t\t\t</tem:xml>\n        </tem:ObtenerClientesColaborador>\n    </x:Body>\n</x:Envelope>";
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;
	xhr.onload = function() {
		//Ti.API.info(this.responseText);
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerBoletosColaboradorPorSorteoResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlBoletos = XMLObject.getElementsByTagName("raiz");
		//Ti.API.info('xml:\n' + JSON.stringify(xmlCompradores, null, 4));
		//Ti.API.info(xmlCompradores.length);
		boletosColaborador = [];
		for( i = 0; i < xmlBoletos.length; i++) {
			//var nombre =
			var numeroBoleto = xmlBoletos.item(i).getElementsByTagName("numeroBoleto").item(0).textContent;
		
			
			boletosColaborador.push({
				boleto : numeroBoleto,
				 
			});
		}
		Ti.API.info('compradores:\n' + JSON.stringify(boletosColaborador, null, 4));
		Alloy.Globals.boletosColaborador = boletosColaborador;
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


Alloy.Globals.login = function() {
	Ti.API.info('login:' + loginColaborador + ' password:' + passwordColaborador);
	if(loginColaborador != '' && passwordColaborador != '') {
		Alloy.Globals.Cloud.Users.login({
			login : loginColaborador,
			password : passwordColaborador
		}, function(e) {
			if(e.success) {
				Alloy.Globals.Cloud.Users.showMe(function(e) {
					if(e.success) {

						var user = e.users[0];
						Ti.App.Properties.setString('login', user.username);
						Ti.App.Properties.setString('password', passwordColaborador);
						//Ti.API.info('USER: /n ' + JSON.stringify(user, null, 4));

						Alloy.Globals.colaborador = user;
						Alloy.Globals.contactos = JSON.parse(user.custom_fields.compradores);
						//Ti.API.info('COLABORADOR:\n ' + JSON.stringify(Alloy.Globals.colaborador, null,
						// 4));
						//Ti.API.info('COMPRADORES: \n ' + JSON.stringify(Alloy.Globals.compradores,
						// null, 4));
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

};


Alloy.Globals.login();
Alloy.Globals.WsObtenerSorteos();
Alloy.Globals.WsObtenerClientesColaborador(1662196);

