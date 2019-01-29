Ti.API.info('test');
//Produccion
var servicioWeb =   'http://colaboro.sorteostec.org/ServicioAppColaboro/v1/Service.svc'; 
//var servicioWeb = 'http://devcrm.sorteostec.org/ServicioColaboro/v1/Service.svc';
//var servicioWeb = 'http://10.97.129.29/ServicioColaboro/v1/Service.svc';
//var servicioWeb = 'http://servicioscrm.sorteostec.org/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc';

//Desarrollo
var servicioWeb =   'http://stagecolaboro.sorteostec.org/ServicioColaboro/v1/Service.svc'; 
var servicioWebPago = 'http://servicioscrm.sorteostec.org/CRM/Desarrollo/ServicioPagoElectronico/v1/Service.svc';


Alloy.Globals.Cloud = require('ti.cloud');

//inicializar variables globales
Alloy.Globals.margenNotch=15;
Alloy.Globals.reinicioVariables = function() {
	Alloy.Globals.estaLogeado = false;
	Alloy.Globals.contactos = [];
	Alloy.Globals.compradores = [];
	Alloy.Globals.notificaciones = [];
	Alloy.Globals.boletosColaborador = [];
	Alloy.Globals.idSorteoCuentaRegresiva = 0;
	Alloy.Globals.fechaSorteoCuentaRegresiva = 0;
	Alloy.Globals.colaborador = '';
	Alloy.Globals.premios = [];
	Alloy.Globals.menusCargados = 0;
	Alloy.Globals.resultadoLogin = {
		exitoso : 0
	};
	Alloy.Globals.saldos = [];
	Alloy.Globals.saldoGlobal = [];   
	Alloy.Globals.EmpleadoVenta = [];
	
	var deviceToken = null;

};

Alloy.Globals.reinicioVariables();
// NOTIFICACIONES

//Alloy.Globals.contactos = Ti.App.Properties.getList('listaContactos', []);

Alloy.Globals.maxId = Ti.App.Properties.getInt('maxId', 1);
var pass = Ti.App.Properties.getString('password', '');
var log = Ti.App.Properties.getString('login', '');

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
Alloy.Globals.listaMensajes = [];


//Obtener llaves globales
Alloy.Globals.leerCuentaRegresiva = function(callback, error) {
	Alloy.Globals.Cloud.KeyValues.get({
		name : 'idsorteocuentaregresiva'
	}, function(e) {
		if(e.success) {
			var idSorteo = e.keyvalues[0].value;
			//Ti.API.info('idsorteocuentaregresiva: ');
			//Ti.API.info('idsorteocuentaregresiva:\n' + JSON.stringify(idSorteo, null, 4));
			if(idSorteo > 0) {
				Alloy.Globals.Cloud.KeyValues.get({
					name : 'fechacuentaregresiva'
				}, function(e) {
					if(e.success) {
						var fecha = e.keyvalues[0].value;

						Alloy.Globals.idSorteoCuentaRegresiva = idSorteo;
						Alloy.Globals.fechaSorteoCuentaRegresiva = fecha;
						Ti.API.info('idSorteoCuentaRegresiva:' + Alloy.Globals.idSorteoCuentaRegresiva + '\nfechaSorteoCuentaRegresiva:' + Alloy.Globals.fechaSorteoCuentaRegresiva);
						callback();
						//Alloy.Globals.cargaCuentaRegresiva();
					} else {
						error();
					}
				});
			}
		}
	});

};

//SERVICIOS

Alloy.Globals.WsObtenerSorteos = function(callback) {

	Ti.API.info('prueba ObtenerSorteos: ');
	var data = [];

	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\n    <x:Header/>\n    <x:Body>\n        <tem:ObtenerSorteos></tem:ObtenerSorteos>\n    </x:Body>\n</x:Envelope>";
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;
	xhr.onload = function() {
		// Assuming that you have a valid json response
		Ti.API.info('ObtenerSorteos onLoad: ');
		//Ti.API.info('responde: \n '+JSON.stringify(this.responseText, null, 4));
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerSorteosResult");
		//alert('enviroment:' + Ti.App.deployType.toLowerCase() );
		//alert('validatesSecureCertificate:' + xhr.validatesSecureCertificate );
		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlSorteos = XMLObject.getElementsByTagName("SORTEO");
		Ti.API.info('xml:\n' + JSON.stringify(xmlSorteos.length, null, 4));
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
			if(parseInt(TipoSorteo) < 20) {
				var sorteo = Alloy.createModel('modeloSorteo', {
					id : IdSorteo,
					nombreSorteo : Descripcion,
					activo : EnVenta,
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
		}
		asignarImagenesSorteo();
		callback();
		//Ti.API.info('sorteosActivos' + JSON.stringify(Alloy.Collections.sorteosActivos,
		// null, 4));
		//Ti.API.info('sorteosActivos:\n' +
		// JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));
	};

	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("error");
		return;

	};
	xhr.open("POST", servicioWeb);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerSorteos");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "983da4bd-5d13-4c54-84d9-a500527f55aa");
	xhr.setValidatesSecureCertificate(true);
	xhr.validatesSecureCertificate = true;
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
	var theURL = servicioWeb;
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
			if(telefono.trim() != '') {
				compradores.push({
					nombre : comprador,
					telefono : telefono
				});
			}
		}
		//Ti.API.info('compradores:\n' + JSON.stringify(compradores, null, 4));
		Alloy.Globals.compradores = compradores;
		//callback();
	};
	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("error");
		Ti.API.info(JSON.stringify(e, null, 4));

		return;

	};
	xhr.open("POST", servicioWeb);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerClientesColaborador");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.setValidatesSecureCertificate(true);
	xhr.validatesSecureCertificate = true;
	xhr.send(body);

};

Alloy.Globals.WsObtenerBoletosColaboradorPorSorteo = function(idColaborador, tipoSorteo, numeroSorteo, callback, error) {

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

	var theURL = servicioWeb;
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
		callback();
	};

	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
		Ti.API.info(JSON.stringify(e, null, 4));
		error();
		return;

	};

	xhr.open("POST", servicioWeb, false);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerBoletosColaboradorPorSorteo");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.setValidatesSecureCertificate(true);
	xhr.validatesSecureCertificate = true;
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

	var theURL = servicioWeb;
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

	xhr.open("POST", servicioWeb);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerObsequiosColaborador ");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.setValidatesSecureCertificate(true);
	xhr.validatesSecureCertificate = true;
	xhr.send(body);

};

Alloy.Globals.WsObtenerDescripcionPremios = function(idColaborador, idSorteo, callback, timeout) {

	Ti.API.info('prueba ObtenerDescripcionPremios  : ');
	var data = [];

	// @formatter:off
	var xmlParametros = "<![CDATA[" 
				+ " <raiz> "
					+"<idColaborador>" + idColaborador.toString() + "</idColaborador>" 
					+ "<idSorteo>" + idSorteo.toString() + "</idSorteo> " 
				+ "</raiz>"
			+ " ]]>";
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
			+"<x:Header/>"
			+"<x:Body>"
			+"<tem:ObtenerDescripcionPremios>"
			+"     <tem:xml>" + xmlParametros + "</tem:xml>"
			+"</tem:ObtenerDescripcionPremios>"
			+"</x:Body>\n</x:Envelope>";
	// @formatter:on

	var theURL = servicioWeb;
	var xhr = Titanium.Network.createHTTPClient({
		timeout : 5000
	});
	//xhr.withCredentials = true;

	xhr.onload = function() {
		//Ti.API.info(this.responseText);
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerDescripcionPremiosResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlPremios = XMLObject.getElementsByTagName("premios");
		//Ti.API.info('xml:\n' + JSON.stringify(xmlObsequios.length, null, 4));

		premios = [];
		for( i = 0; i < xmlPremios.length; i++) {
			//var nombre =
			try {
				var idSorteo = xmlPremios.item(i).getElementsByTagName("idSorteo").item(0).textContent;
				var numeroSorteo = xmlPremios.item(i).getElementsByTagName("numeroSorteo").item(0).textContent;
				var idTipoProducto = xmlPremios.item(i).getElementsByTagName("idTipoProducto").item(0).textContent;
				var numeroBoleto = xmlPremios.item(i).getElementsByTagName("numeroBoleto").item(0).textContent;
				var descripcion = xmlPremios.item(i).getElementsByTagName("descripcion").item(0).textContent;
				var nombreRotulado = xmlPremios.item(i).getElementsByTagName("nombreRotulado").item(0).textContent;

				premios.push({
					idSorteo : idSorteo,
					numeroSorteo : numeroSorteo,
					idTipoProducto : idTipoProducto,
					numeroBoleto : numeroBoleto,
					descripcion : descripcion,
					nombreRotulado : nombreRotulado
				});

			} catch (err) {
			}
		}
		//Ti.API.info('ObtenerDescripcionPremios:\n' + JSON.stringify(premios, null, 4));
		Alloy.Globals.premios = premios;
		callback();
	};

	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
		Ti.API.info(JSON.stringify(e, null, 4));
		timeout();
		return;

	};

	xhr.open("POST", servicioWeb);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerDescripcionPremios");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.setValidatesSecureCertificate(true);
	xhr.validatesSecureCertificate = true;
	xhr.send(body);

};


Alloy.Globals.WsObtenerPagos = function(idColaborador, callback, timeout) {

     Ti.API.info('prueba ObtenerPagos  : ');
     var data = [];

     // @formatter:off
     var xmlParametros = "<![CDATA[" 
                    + " <raiz> "
                         +"<idColaborador>" + idColaborador.toString() + "</idColaborador>" 
                    + "</raiz>"
               + " ]]>";
     var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
               +"<x:Header/>"
               +"<x:Body>"
               +"<tem:ObtenerDescripcionPremios>"
               +"     <tem:xml>" + xmlParametros + "</tem:xml>"
               +"</tem:ObtenerDescripcionPremios>"
               +"</x:Body>\n</x:Envelope>";
     // @formatter:on

     var theURL = servicioWeb;
     var xhr = Titanium.Network.createHTTPClient({
          timeout : 5000
     });
     //xhr.withCredentials = true;

     xhr.onload = function() {
          //Ti.API.info(this.responseText);
          var xml = this.responseXML.documentElement;
          var elements = xml.getElementsByTagName("ObtenerDescripcionPremiosResult");

          //Ti.API.info(xml);
          var xmlText = elements.item(0).textContent;
          var XMLObject = Titanium.XML.parseString(xmlText);
          var xmlPremios = XMLObject.getElementsByTagName("premios");
          //Ti.API.info('xml:\n' + JSON.stringify(xmlObsequios.length, null, 4));

          premios = [];
          for( i = 0; i < xmlPremios.length; i++) {
               //var nombre =
               try {
                    var idSorteo = xmlPremios.item(i).getElementsByTagName("idSorteo").item(0).textContent;
                    var numeroSorteo = xmlPremios.item(i).getElementsByTagName("numeroSorteo").item(0).textContent;
                    var idTipoProducto = xmlPremios.item(i).getElementsByTagName("idTipoProducto").item(0).textContent;
                    var numeroBoleto = xmlPremios.item(i).getElementsByTagName("numeroBoleto").item(0).textContent;
                    var descripcion = xmlPremios.item(i).getElementsByTagName("descripcion").item(0).textContent;
                    var nombreRotulado = xmlPremios.item(i).getElementsByTagName("nombreRotulado").item(0).textContent;

                    premios.push({
                         idSorteo : idSorteo,
                         numeroSorteo : numeroSorteo,
                         idTipoProducto : idTipoProducto,
                         numeroBoleto : numeroBoleto,
                         descripcion : descripcion,
                         nombreRotulado : nombreRotulado
                    });

               } catch (err) {
               }
          }
          //Ti.API.info('ObtenerDescripcionPremios:\n' + JSON.stringify(premios, null, 4));
          Alloy.Globals.premios = premios;
          callback();
     };

     xhr.onerror = function(e)/* on  error in getting data from server */
     {
          //check response status and act aaccordingly.
          Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
          Ti.API.info(JSON.stringify(e, null, 4));
          timeout();
          return;

     };

     xhr.open("POST", servicioWeb);

     xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
     xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerDescripcionPremios");
     xhr.setRequestHeader("Cache-Control", "no-cache");
     xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
     xhr.setValidatesSecureCertificate(true);
     xhr.validatesSecureCertificate = true;
     xhr.send(body);

};





Alloy.Globals.WsObtenerIdEmpleadoVenta = function(idColaborador,  callback, timeout) {

     Ti.API.info('prueba ObtenerIdEmpleadoVenta  : ');
     var data = [];

     // @formatter:off
     var xmlParametros = "<![CDATA[" 
                    + " <raiz> "
                         +"<idColaborador>" + idColaborador.toString() + "</idColaborador>" 
                    + "</raiz>"
               + " ]]>";
     var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
               +"<x:Header/>"
               +"<x:Body>"
               +"<tem:ObtenerIdEmpleadoVenta>"
               +"     <tem:xml>" + xmlParametros + "</tem:xml>"
               +"</tem:ObtenerIdEmpleadoVenta>"
               +"</x:Body>\n</x:Envelope>";
     // @formatter:on

     var theURL = servicioWeb;
     var xhr = Titanium.Network.createHTTPClient({
          timeout : 5000
     });
     //xhr.withCredentials = true;

     xhr.onload = function() {
          //Ti.API.info(this.responseText);
          var xml = this.responseXML.documentElement;
          var elements = xml.getElementsByTagName("ObtenerIdEmpleadoVentaResult");

          //Ti.API.info(xml);
          var xmlText = elements.item(0).textContent;
          var XMLObject = Titanium.XML.parseString(xmlText);
          var xmlEmpleadoVenta = XMLObject.getElementsByTagName("medioVentaPadre");
          //Ti.API.info('xml:\n' + JSON.stringify(xmlObsequios.length, null, 4));

          empleadoVenta = [];
         try {
                    var idEmpleadoVenta = xmlEmpleadoVenta.item(0).getElementsByTagName("idEmpleadoVenta").item(0).textContent;
                    var nombreEjecutivo = xmlEmpleadoVenta.item(0).getElementsByTagName("nombreEjecutivo").item(0).textContent;
                    empleadoVenta = {
                         idEmpleadoVenta : idEmpleadoVenta,
                         nombreEjecutivo : nombreEjecutivo
                         };
               } catch (e) {

                    //alert(xmlPremios.item(i).getElementsByTagName("mensaje").item(0).textContent);
               }
          //Ti.API.info('ObtenerDescripcionPremios:\n' + JSON.stringify(premios, null, 4));
          Alloy.Globals.EmpleadoVenta = empleadoVenta;
          callback();
     };

     xhr.onerror = function(e)/* on  error in getting data from server */
     {
          //check response status and act aaccordingly.
          Ti.API.info("ObtenerIdEmpleadoVenta error");
          Ti.API.info(JSON.stringify(e, null, 4));
          timeout();
          return;

     };

     xhr.open("POST", servicioWeb);

     xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
     xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerIdEmpleadoVenta");
     xhr.setRequestHeader("Cache-Control", "no-cache");
     xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
     xhr.setValidatesSecureCertificate(true);
     xhr.validatesSecureCertificate = true;
     xhr.send(body);

};

Alloy.Globals.WsEsAccesoValido = function(loginColaborador, passwordColaborador, callback) {

	Ti.API.info('prueba EsAccesoValido  : ');
	var data = [];

	// @formatter:off
	var xmlParametros = "<![CDATA[" 
				+ " <raiz> "
					+"<cuentaColaborapp>" + loginColaborador.toString() + "</cuentaColaborapp>" 
					+ "<contrasenaColaborapp>" + passwordColaborador.toString() + "</contrasenaColaborapp> " 
				+ "</raiz>"
			+ " ]]>";
			
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
			+"<x:Header/>"
			+"<x:Body>"
			+"<tem:EsAccesoValido>"
			+"     <tem:xml>" + xmlParametros + "</tem:xml>"
			+"</tem:EsAccesoValido>"
			+"</x:Body>\n</x:Envelope>";
	// @formatter:on

	var theURL = servicioWeb;
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;

	xhr.onload = function() {
		//Ti.API.info(this.responseText);
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("EsAccesoValidoResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlPremios = XMLObject.getElementsByTagName("resultado");
		//Ti.API.info('xml:\n' + JSON.stringify(xmlObsequios.length, null, 4));

		resultadoLogin = {};
		for( i = 0; i < xmlPremios.length; i++) {
			//var nombre =
			try {
				var exitoso = xmlPremios.item(i).getElementsByTagName("exitoso").item(0).textContent;
				var mensaje = xmlPremios.item(i).getElementsByTagName("mensaje").item(0).textContent;
				var nombreColaborador = xmlPremios.item(i).getElementsByTagName("nombreColaborador").item(0).textContent;
				resultadoLogin = {
					exitoso : exitoso,
					nombreColaborador : nombreColaborador,
					mensaje : mensaje
				};
			} catch (e) {

				//alert(xmlPremios.item(i).getElementsByTagName("mensaje").item(0).textContent);
			}
		}
		Alloy.Globals.resultadoLogin = resultadoLogin;
		Ti.API.info('resultadoLogin:' + JSON.stringify(Alloy.Globals.resultadoLogin, null, 4));
		callback();
	};

	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
		Ti.API.info(JSON.stringify(e, null, 4));

		return;

	};

	xhr.open("POST", servicioWeb, false);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/EsAccesoValido");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.setValidatesSecureCertificate(true);
	xhr.validatesSecureCertificate = true;
	xhr.send(body);

};

Alloy.Globals.WsObtenerEstadoCuentaColaborador = function(idColaborador, callback, timeout) {

	Ti.API.info('prueba WsObtenerEstadoCuentaColaborador   idColaborador: ' + idColaborador);
	var data = [];

	// @formatter:off
	var xmlParametros = "<![CDATA[" 
				+ " <raiz> "
					+"<idColaborador>" + idColaborador.toString() + "</idColaborador>" 
				+ "</raiz>"
			+ " ]]>";
			
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
			+"<x:Header/>"
			+"<x:Body>"
			+"<tem:ObtenerEstadoCuentaColaborador>"
			+"     <tem:xml>" + xmlParametros + "</tem:xml>"
			+"</tem:ObtenerEstadoCuentaColaborador>"
			+"</x:Body>\n</x:Envelope>";
	// @formatter:on

	var theURL = servicioWeb;
	var xhr = Titanium.Network.createHTTPClient({
		timeout : 18000
	});
	//xhr.withCredentials = true;

	xhr.onload = function() {
		//Ti.API.info(this.responseText);
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerEstadoCuentaColaboradorResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlsaldos = XMLObject.getElementsByTagName("saldo");
		// Ti.API.info('xml saldos 	:' + JSON.stringify(xmlsaldos.length, null, 4));

		saldos = [];

		for( i = 0; i < xmlsaldos.length; i++) {
			// Ti.API.info('xml item 	:' + JSON.stringify(xmlsaldos.item(i), null, 4));

			var talones = 0;
			try {
				var talones = xmlsaldos.item(i).getElementsByTagName("talones").item(0).textContent;
			} catch(err) {
			}
			try {
				var idJuego = xmlsaldos.item(i).getElementsByTagName("idJuego").item(0).textContent;
				var idProducto = xmlsaldos.item(i).getElementsByTagName("idProducto").item(0).textContent;
				var numeroJuego = xmlsaldos.item(i).getElementsByTagName("numeroJuego").item(0).textContent;
				var nombreJuego = xmlsaldos.item(i).getElementsByTagName("nombreJuego").item(0).textContent;
				var saldo = xmlsaldos.item(i).getElementsByTagName("saldo").item(0).textContent;
				var monto = xmlsaldos.item(i).getElementsByTagName("monto").item(0).textContent;
				var orden = xmlsaldos.item(i).getElementsByTagName("orden").item(0).textContent;
				var fecha_cierre = xmlsaldos.item(i).getElementsByTagName("fecha_cierre").item(0).textContent;
				var esJuegoVigente = xmlsaldos.item(i).getElementsByTagName("esJuegoVigente").item(0).textContent;

				saldos.push({
					idJuego : idJuego,
					idProducto : idProducto,
					numeroJuego : numeroJuego,
					nombreJuego : nombreJuego,
					saldo : saldo,
					monto : monto,
					orden : orden,
					fecha_cierre : fecha_cierre,
					esJuegoVigente : esJuegoVigente,
					talones : talones,
				});
			} catch(err) {
			}

		}

		Alloy.Globals.saldos = saldos;
		callback();
		//Ti.API.info('ObtenerEstadoCuentaColaborador:' +
		// JSON.stringify(Alloy.Globals.saldos, null, 4));

	};

	xhr.onerror = function(e)/* on  error in getting data from server */
	{
		//check response status and act aaccordingly.
		Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
		Ti.API.info(JSON.stringify(e, null, 4));
		timeout(e);
		return;

	};

	xhr.open("POST", servicioWeb, true);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerEstadoCuentaColaborador");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.setValidatesSecureCertificate(true);
	xhr.validatesSecureCertificate = true;
	xhr.send(body);

};

Alloy.Globals.WsObtenerSaldoGlobalColaborador = function(idColaborador, callback) {

	Ti.API.info('prueba ObtenerSaldoGlobalColaborador   idColaborador: ' + idColaborador);
	var data = [];

	// @formatter:off
	var xmlParametros = "<![CDATA[" 
				+ " <raiz> "
					+"<idColaborador>" + idColaborador.toString() + "</idColaborador>" 
				+ "</raiz>"
			+ " ]]>";
			
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
			+"<x:Header/>"
			+"<x:Body>"
			+"<tem:ObtenerSaldoGlobalColaborador>"
			+"     <tem:xml>" + xmlParametros + "</tem:xml>"
			+"</tem:ObtenerSaldoGlobalColaborador>"
			+"</x:Body>\n</x:Envelope>";
	// @formatter:on

	var theURL = servicioWeb;
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;

	xhr.onload = function() {
		//Ti.API.info(this.responseText);
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerSaldoGlobalColaboradorResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlsaldo = XMLObject.getElementsByTagName("raiz");

		var saldoGlobal = xmlsaldo.item(0).getElementsByTagName("saldoGlobal").item(0).textContent;
		var puntos = xmlsaldo.item(0).getElementsByTagName("puntos").item(0).textContent;

		// var fechaActualizacion = '15 de Agosto de 2018';
		// try {
		// var fechaActualizacion =
		// xmlsaldo.item(0).getElementsByTagName("fechaActualizacion").item(0).textContent;
		// } catch (err) {
		// }
		var saldoGlobal = {
			saldoGlobal : saldoGlobal,
			puntos : puntos,
			// fechaActualizacion : fechaActualizacion,

		};

		Alloy.Globals.saldoGlobal = saldoGlobal;
		callback();
	};

	xhr.onerror = function(e) {

		Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
		Ti.API.info(JSON.stringify(e, null, 4));

		return;

	};

	xhr.open("POST", servicioWeb, true);

	xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerSaldoGlobalColaborador");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
	xhr.setValidatesSecureCertificate(true);
	xhr.send(body);

};



Alloy.Globals.WsCancelarPagoTarjeta = function(idTransaccion, idUsuario, callback) {

     Ti.API.info('prueba ObtenerSaldoGlobalColaborador   idColaborador: ' + idColaborador);
     var data = [];

     // @formatter:off
     var xmlParametros = "<![CDATA[" 
                    + " <raiz> "
                         +"<idTransaccion>" + idTransaccion.toString() + "</idTransaccion>" 
                         +"<idUsuario>" + idUsuario.toString() + "</idUsuario>" 
                    + "</raiz>"
               + " ]]>";
               
     var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">"
               +"<x:Header/>"
               +"<x:Body>"
               +"<tem:CancelarPagoTarjeta>"
               +"     <tem:xml>" + xmlParametros + "</tem:xml>"
               +"</tem:CancelarPagoTarjeta>"
               +"</x:Body>\n</x:Envelope>";
     // @formatter:on

     var theURL = servicioWebPago;
     var xhr = Titanium.Network.createHTTPClient();
     //xhr.withCredentials = true;

     xhr.onload = function() {
          //Ti.API.info(this.responseText);
          var xml = this.responseXML.documentElement;
          var elements = xml.getElementsByTagName("CancelarPagoTarjetaResult");

          //Ti.API.info(xml);
          var xmlText = elements.item(0).textContent;
          var XMLObject = Titanium.XML.parseString(xmlText);
          var xmlsaldo = XMLObject.getElementsByTagName("raiz");

          var fueExitoso = xmlsaldo.item(0).getElementsByTagName("fueExitoso").item(0).textContent;
          var fueCancelado = xmlsaldo.item(0).getElementsByTagName("fueCancelado").item(0).textContent;
          var mensaje  = xmlsaldo.item(0).getElementsByTagName("mensaje ").item(0).textContent;

          // var fechaActualizacion = '15 de Agosto de 2018';
          // try {
          // var fechaActualizacion =
          // xmlsaldo.item(0).getElementsByTagName("fechaActualizacion").item(0).textContent;
          // } catch (err) {
          // }
          var resultadoCancelacion = {
               fueExitoso : fueExitoso,
               fueCancelado : fueCancelado,
               mensaje : mensaje,
               // fechaActualizacion : fechaActualizacion,

          };

          Alloy.Globals.resultadoCancelacion = resultadoCancelacion;
          callback();
     };

     xhr.onerror = function(e) {

          Ti.API.info("ObtenerBoletosColaboradorPorSorteo error");
          Ti.API.info(JSON.stringify(e, null, 4));

          return;

     };

     xhr.open("POST", servicioWeb, true);

     xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
     xhr.setRequestHeader("SOAPAction", "http://tempuri.org/IService/ObtenerSaldoGlobalColaborador");
     xhr.setRequestHeader("Cache-Control", "no-cache");
     xhr.setRequestHeader("Postman-Token", "e7d9c3bd-ddf0-4b0a-8a8b-bbdf10381fa5");
     xhr.setValidatesSecureCertificate(true);
     xhr.send(body);

};



Alloy.Globals.login = function(loginColaborador, passwordColaborador, callback) {
	Ti.API.info('login:' + loginColaborador + ' password:' + passwordColaborador);
	if(loginColaborador != '' && passwordColaborador != '') {
		Alloy.Globals.Cloud.Users.login({
			login : loginColaborador,
			password : passwordColaborador
		}, function(e) {
			if(e.success) {
				cargaDatosLogin(passwordColaborador, function() {

					callback();
				});
				//callback();
			} else {

				Alloy.Globals.WsEsAccesoValido(loginColaborador, passwordColaborador, function() {
					Ti.API.info('resultadoLogin postTimeout:' + JSON.stringify(Alloy.Globals.resultadoLogin, null, 4));
					if(Alloy.Globals.resultadoLogin.exitoso == 1) {
						Alloy.Globals.Cloud.Users.create({
							username : loginColaborador,
							email : loginColaborador + '@sorteostec.mx',
							first_name : Alloy.Globals.resultadoLogin.nombreColaborador,
							//last_name : 'test_lastname',
							password : passwordColaborador,
							password_confirmation : passwordColaborador,
							custom_fields : {
								compradores : '[]',
								notificaciones : '[]',
								telefono : '',
								direccion : ''

							}
						}, function(e) {
							if(e.success) {
								Ti.API.info('resultadoLogin usuario creado:');
								var user = e.users[0];
								Ti.API.info('user:' + JSON.stringify(user, null, 4));
								Alloy.Globals.Cloud.Users.login({
									login : loginColaborador,
									password : passwordColaborador
								}, function(e) {
									if(e.success) {
										cargaDatosLogin(passwordColaborador, function() {
											alert('callback');
											callback();
										});
										//callback();
									}
								});
							} else {
								Ti.API.info('Error usuario no creado:\n' + ((e.error && e.message) || JSON.stringify(e)));
							}
						});
					} else {
						loginInvitado(function() {
							callback();
						});
						//callback();
					}

				});

			}
		});
	}
};

function loginInvitado(callback) {
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
		callback();
	});
}


function cargaDatosLogin(passwordColaborador, callback) {
	Alloy.Globals.estaLogeado = true;
	Alloy.Globals.Cloud.Users.showMe(function(e) {
		if(e.success) {

			var user = e.users[0];
			Ti.App.Properties.setString('login', user.username);
			Ti.App.Properties.setString('password', passwordColaborador);
			//Ti.API.info('user:' + JSON.stringify(user, null, 4));

			Alloy.Globals.colaborador = user;
			Alloy.Globals.contactos = JSON.parse(user.custom_fields.compradores);
			if(user.custom_fields.notificaciones) {
				Alloy.Globals.notificaciones = JSON.parse(user.custom_fields.notificaciones);
			}
			cargaDatosInicio(user.username);
			Ti.API.info('suscribirNotificaciones');
			//suscribirNotificaciones();

		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
		callback();
	});
}


Alloy.Globals.Logout = function() {
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
		photo_id : '5bbb898f1ce6bb02194dfb84'
	}, function(e) {
		if(e.success) {
			var photo = e.photos[0];
			Alloy.Globals.imagenCalendario = photo.urls.original;
			//Ti.API.info(JSON.stringify(photo.urls.original, null, 4));
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}


Alloy.Globals.obtenerImagenesMenuPrincipal = function(callback) {
	Alloy.Globals.Cloud.PhotoCollections.showPhotos({
		collection_id : "5a4e90755a276e961e1f55f6"
		//5a4e90755a276e961e1f55f6
	}, function(e) {
		if(e.success) {
			if(!e.photos) {
				//alert('Success: No photos');
			} else {
				Alloy.Collections.menuPrincipal.reset();
				e.photos.forEach(function(photo) {
					var menus = Alloy.createModel('modeloMenuPrincipal', {
						activo : photo.custom_fields.activo,
						pantalla : photo.custom_fields.pantalla,
						indice : photo.custom_fields.indice,
						original : photo.urls.original,
						necesitaLogin : photo.custom_fields.necesitaLogin
					});
					menus.save();
					Alloy.Collections.menuPrincipal.push(menus);
				});
				callback();
				
			}
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
};

Alloy.Globals.obtenerMensajes = function() {
	Alloy.Globals.Cloud.PhotoCollections.showPhotos({
		collection_id : "5b353815625c1b02194ce94a"
		//5a4e90755a276e961e1f55f6
	}, function(e) {
		if(e.success) {
			if(e.photos) {
				var mensajes = [];
				e.photos.forEach(function(photo) {  

					if(photo.custom_fields.activo) {
						mensajes.push({
							icono : photo.urls.original,
							texto : photo.custom_fields.texto

						});
					}
				});
				Alloy.Globals.listaMensajes = mensajes;
				Ti.API.info('obtenerImagenesMensajes:' + JSON.stringify(Alloy.Globals.listaMensajes, null, 4));
			}
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
};

//METODOS

Alloy.Globals.esNumero = function(number) {
    var letters = /^[0-9.,$]+$/;
    var bl = false; 
    if (number.match(letters)) {

        bl = true;
    }
    return bl;
};

function asignarImagenesSorteo() {

	Ti.API.info("asignarImagenesSorteo");
	Alloy.Globals.Cloud.PhotoCollections.showPhotos({
		collection_id : "5a6b839824ee48c54b8ecad7"
	}, function(e) {
		if(e.success) {
			if(!e.photos) {
				//agregar mensaje de que no hay sorteos activos
			} else {

				e.photos.forEach(function(photo) {
					//Ti.API.info(JSON.stringify(photo.custom_fields.idSorteo, null, 4));
					var sorteosPorTipo = Alloy.Collections.sorteosActivos.where({
						tipoSorteo : photo.custom_fields.idSorteo.toString()
					});
					//Ti.API.info(JSON.stringify(sorteosPorTipo, null, 4));
					sorteosPorTipo.forEach(function(sorteo) {

						sorteo.set({
							original : photo.urls.original,
							miniatura : photo.urls.thumb_100
							//activo : 1
						});

					});
				});

				//Ti.API.info("SORTEOS ACTIVOS \n" +
				//JSON.stringify('SORTEOSACTIVOSIMAGENES:' + Alloy.Collections.sorteosActivos,
				// null, 4);

			}
		} else {
			//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});

}


Alloy.Globals.actualizarLogin = function(nombre, correo, telefono, correcto, error) {
	Alloy.Globals.Cloud.Users.update({
		email : correo,
		first_name : nombre,
		custom_fields : {
			telefono : telefono
		}
	}, function(e) {
		if(e.success) {
			var user = e.users[0];
			Alloy.Globals.Cloud.Users.showMe(function(e) {
				if(e.success) {

					var user = e.users[0];

					Alloy.Globals.colaborador = user;
					Alloy.Globals.contactos = JSON.parse(user.custom_fields.compradores);
					Alloy.Globals.notificaciones = JSON.parse(user.custom_fields.notificaciones);

					cargaDatosInicio(user.username);
					correcto();

				} else {
					Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					error();
				}

			});
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
};


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
			compradores : JSON.stringify(Alloy.Globals.contactos),
			notificaciones : JSON.stringify(Alloy.Globals.notificaciones)

		}
	}, function(e) {
		if(e.success) {
			Ti.API.info('Guardado');
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});

	Ti.API.info('notif:' + JSON.stringify(Alloy.Globals.notificaciones, null, 4));
	Ti.API.info('contactos:' + JSON.stringify(Alloy.Globals.contactos, null, 4));
	Ti.App.Properties.setList('listaContactos', Alloy.Globals.contactos);
	Alloy.Globals.maxId = Alloy.Globals.maxId + 1;
	Ti.App.Properties.setInt('maxId', Alloy.Globals.maxId);
	Ti.API.info(Alloy.Globals.maxId);
}; 




function suscribirNotificaciones() {

	if(Ti.Platform.osname == 'android') {
		var CloudPush = require('ti.cloudpush');

		// Initialize the module
		CloudPush.retrieveDeviceToken({
			success : deviceTokenSuccess,
			error : deviceTokenError
		});

		// Enable push notifications for this device
		// Save the device token for subsequent API calls

		function deviceTokenError(e) {
			alert('Failed to register for push notifications! ' + e.error);
		}


		// Process incoming push notifications
		CloudPush.addEventListener('callback', function(evt) {
			//alert("Notification received: " + evt.payload);
			var notif = JSON.parse(evt.payload);
			Ti.API.info('notificacion:\n' + JSON.stringify(notif, null, 4));

			Alloy.Globals.notificaciones.push({
				tipo : notif.custom_field.tipo,
				titulo : notif.android.title,
				detalle : notif.android.alert,
				fecha : notif.custom_field.fecha,
			});
			Alloy.Globals.guardarContactos();

		});
	}
}





function deviceTokenSuccess(e) {
	deviceToken = e.deviceToken;
	//alert('deviceTokenSuccess' + deviceToken);

	var Cloud = require("ti.cloud");
	Alloy.Globals.Cloud.PushNotifications.subscribeToken({
		device_token : deviceToken,
		channel : 'colaboro',
		type : Ti.Platform.name === 'android' ? 'android' : 'ios'
	}, function(e) {
		if(e.success) {
			// alert('Subscribed');
			Ti.API.info('Subscribed');

		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}



		
Alloy.Globals.unsubscribeToChannel = function (){
//  Alloy.Globals.Cloud.PushNotifications.unsubscribe({
//         channel: 'test',
//         device_token: deviceToken
//     }, function (e)     {
//         if (e.success) {
//             Ti.API.info('Unsubscribed');
//         } else {
//           		  alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
//         }
//     }); 
};


Alloy.Globals.login(log, pass, function() {
	leercalendario();
	Alloy.Globals.obtenerMensajes();

});

Alloy.Globals.pixelToDp = function(px) {
	return (parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
};

Alloy.Globals.anchoPantalla = function(a) {
	var anchoPantalla = Ti.Platform.displayCaps.platformWidth;

	if(Ti.Platform.osname == 'android') {
		anchoPantalla = Alloy.Globals.pixelToDp(anchoPantalla);
	}
	return anchoPantalla;
};

function cargaDatosInicio(idColaborador) {

	Alloy.Globals.WsObtenerClientesColaborador(idColaborador);
}





Alloy.Globals.isiPhoneX = function() {
	return (Ti.Platform.displayCaps.platformWidth === 375 && Ti.Platform.displayCaps.platformHeight == 812) ||
	// // Portrait
	(Ti.Platform.displayCaps.platformHeight === 812 && Ti.Platform.displayCaps.platformWidth == 375);
	// Landscape
};

