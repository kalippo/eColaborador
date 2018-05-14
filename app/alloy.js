Ti.API.info('test');
Alloy.Globals.Cloud = require('ti.cloud');

//Alloy.Globals.contactos = [];
Alloy.Globals.contactos = Ti.App.Properties.getList('listaContactos', []);
Alloy.Globals.maxId = Ti.App.Properties.getInt('maxId', 1);
var login = Ti.App.Properties.getString('password', '');
var password = Ti.App.Properties.getString('login', '');

Ti.API.info('login:' + login + ' password:' + password);
if(login != '' && password != '') {
	Alloy.Globals.Cloud.Users.login({
		login : login,
		password : password
	}, function(e) {
		if(e.success) {
			Alloy.Globals.Cloud.Users.showMe(function(e) {
				if(e.success) {
					 
					var user = e.users[0];
					Ti.App.Properties.setString('login', user.username);
					Ti.App.Properties.setString('password', password);
					var Datoscolaborador = Alloy.createModel('modeloColaborador', {
						idColaborador : user.username,
						nombre : user.first_name,
						telefono : user.telefono,
						direccion : user.direccion
					});
					Datoscolaborador.save();
					Alloy.Collections.colaborador.push(Datoscolaborador);
					Alloy.Globals.user = user;
					Alloy.Globals.contactos  = JSON.parse(user.custom_fields.compradores);
					
					alert('Success:\n' + 'id: ' + user.id + '\n' + 'first name: ' + user.first_name + '\n' + 'last name: ' + user.last_name);
				} else {
					alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				}
			});
		} else {

			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}    

(function() {
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
})();


var collectionMenuPrincipal = Backbone.Collection.extend();
var menuPrincipal = new collectionMenuPrincipal();
Alloy.Collections.menuPrincipal = menuPrincipal;

var collectionSorteosActivos = Backbone.Collection.extend();
var sorteosActivos = new collectionSorteosActivos();
Alloy.Collections.sorteosActivos = sorteosActivos;

var collectionColaboradorActivos = Backbone.Collection.extend();
var colaborador = new collectionColaboradorActivos();
Alloy.Collections.colaborador = colaborador;
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

//CLIENTES DEL COLABORADOR

Alloy.Globals.compradores = {
	"Clientes" : {
		"Nombres" : [{
			"Nombre" : "ABBEY JEZABEL RODRIGUEZ GASPAR",
			"Telefono" : "8119564921",
			"Extensión" : ""
		}, {
			"Nombre" : "ALFONSO  MUÑOZ HURTADO",
			"Telefono" : "8115153030",
			"Extensión" : "4931"
		}, {
			"Nombre" : "ANA ROCIO ROBLES SANCHEZ",
			"Telefono" : "8181931914",
			"Extensión" : ""
		}, {
			"Nombre" : "ARTURO ISRAEL GONZALEZ PEREZ",
			"Telefono" : "8183230759",
			"Extensión" : ""
		}, {
			"Nombre" : "GUILLERMO  MAHID ",
			"Telefono" : "5530091536",
			"Extensión" : ""
		}, {
			"Nombre" : "GUILLERMO CHAHIEL KAREN AYALA",
			"Telefono" : "5530091536",
			"Extensión" : ""
		}, {
			"Nombre" : "HERNALDO  ARROYO SUSTAITA",
			"Telefono" : "8183544596",
			"Extensión" : ""
		}, {
			"Nombre" : "HIGINIO JUNIOR SANDOVAL LEAL",
			"Telefono" : "8117745465",
			"Extensión" : ""
		}, {
			"Nombre" : "JOSE DE JESUS JIMENEZ MARTINEZ",
			"Telefono" : "8113981007",
			"Extensión" : ""
		}, {
			"Nombre" : "LEONARD RUSSELL GREEN COLMENARES",
			"Telefono" : "8114884128",
			"Extensión" : ""
		}, {
			"Nombre" : "LESLI  VERA HERNANDEZ",
			"Telefono" : "8111744473",
			"Extensión" : ""
		}, {
			"Nombre" : "LUIS ANTONIO CALVILLO GUZMAN",
			"Telefono" : "8180263853",
			"Extensión" : ""
		}, {
			"Nombre" : "LUIS GERARDO HERNANDEZ DE LA ROSA",
			"Telefono" : "8110400167",
			"Extensión" : ""
		}, {
			"Nombre" : "LUIS GERARDO HERNANDEZ DE LA ROSA",
			"Telefono" : "8113468542",
			"Extensión" : ""
		}, {
			"Nombre" : "LUIS RICARDO HERNANDEZ DE LA ROSA",
			"Telefono" : "8117368659",
			"Extensión" : ""
		}, {
			"Nombre" : "MARIA DEL ROSARIO SOTO GONZALEZ",
			"Telefono" : "8183230759",
			"Extensión" : ""
		}, {
			"Nombre" : "NELSON ISRAEL RODRIGUEZ SANCHEZ",
			"Telefono" : "8119564921",
			"Extensión" : ""
		}, {
			"Nombre" : "ORLANDO RUBEN DE LA ROSA GARCIA",
			"Telefono" : "8110434346",
			"Extensión" : ""
		}, {
			"Nombre" : "ROSALINDA  PEREZ PEÑA",
			"Telefono" : "8113943575",
			"Extensión" : ""
		}, {
			"Nombre" : "ROSARIO  SOTO GONZALEZ",
			"Telefono" : "8119774281",
			"Extensión" : ""
		}, {
			"Nombre" : "WILFRIDO  CANELA COSS",
			"Telefono" : "8130928308",
			"Extensión" : ""
		}, {
			"Nombre" : "XIMENA SOPHIA MUÑOZ VERA",
			"Telefono" : "8113468542",
			"Extensión" : ""
		}]
	}
};

// GLOBALES

//cargar sorteos

Alloy.Globals.cargaSorteosActivosWS = function() {

	Ti.API.info('prueba wcf: ');
	var data = [];
	var theURL = 'http://10.97.129.14/AppColaborador/Desarrollo/ServicioAppColaborador/v1/Service.svc';
	var body = "<x:Envelope xmlns:x=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\n    <x:Header/>\n    <x:Body>\n        <tem:ObtenerSorteos></tem:ObtenerSorteos>\n    </x:Body>\n</x:Envelope>";
	var xhr = Titanium.Network.createHTTPClient();
	//xhr.withCredentials = true;
	xhr.onload = function() {
		// Assuming that you have a valid json response
		//Ti.API.info('ws: ');
		//Ti.API.info(JSON.stringify(this.responseText, null, 4));
		var xml = this.responseXML.documentElement;
		var elements = xml.getElementsByTagName("ObtenerSorteosResult");

		//Ti.API.info(xml);
		var xmlText = elements.item(0).textContent;
		var XMLObject = Titanium.XML.parseString(xmlText);
		var xmlSorteos = XMLObject.getElementsByTagName("SORTEO");
		//Ti.API.info(xmlSorteos.length);
		var sorteos = [];
		Alloy.Collections.sorteosActivos.reset();
		for( i = 0; i < xmlSorteos.length; i++) {
			var IdSorteo = xmlSorteos.item(i).getElementsByTagName("IdSorteo").item(0).textContent;
			var Descripcion = xmlSorteos.item(i).getElementsByTagName("Descripcion").item(0).textContent;
			var TipoSorteo = xmlSorteos.item(i).getElementsByTagName("TipoSorteo").item(0).textContent;
			var NumeroSorteo = xmlSorteos.item(i).getElementsByTagName("NumeroSorteo").item(0).textContent;
			var FechaInicio = xmlSorteos.item(i).getElementsByTagName("FechaInicio").item(0).textContent;
			var FechaFin = xmlSorteos.item(i).getElementsByTagName("FechaFin").item(0).textContent;
			var FechaFiniquito = xmlSorteos.item(i).getElementsByTagName("FechaFiniquito").item(0).textContent;
			var PrecioUnitario = xmlSorteos.item(i).getElementsByTagName("PrecioUnitario").item(0).textContent;
			var Emision = xmlSorteos.item(i).getElementsByTagName("Emision").item(0).textContent;
			var EnVenta = xmlSorteos.item(i).getElementsByTagName("EnVenta").item(0).textContent;
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
		//Ti.API.info(JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));
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
				//Ti.API.info(JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));

			}
		} else {
			//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});

};

Alloy.Globals.cargaSorteosActivosWS();

