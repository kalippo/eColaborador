Ti.API.info('test');
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

Alloy.Globals.Cloud = require('ti.cloud');

var collectionMenuPrincipal = Backbone.Collection.extend();
var menuPrincipal = new collectionMenuPrincipal();
Alloy.Collections.menuPrincipal = menuPrincipal;

var collectionSorteosActivos = Backbone.Collection.extend();
var sorteosActivos = new collectionSorteosActivos();
Alloy.Collections.sorteosActivos = sorteosActivos;

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

Alloy.Globals.compradores =  {
	"Clientes": {
		"Nombres": [
			{
				"Nombre": "ABBEY JEZABEL RODRIGUEZ GASPAR",
				"Teléfono": "8119564921",
				"Extensión": ""
			}, 
			
			{
				"Nombre": "ALFONSO  MUÑOZ HURTADO",
				"Teléfono": "8115153030",
				"Extensión": "4931"
			},
			{
				"Nombre": "ANA ROCIO ROBLES SANCHEZ",
				"Teléfono": "8181931914",
				"Extensión": ""
			},
			{
				"Nombre": "ARTURO ISRAEL GONZALEZ PEREZ",
				"Teléfono": "8183230759",
				"Extensión": ""
			},
			{
				"Nombre": "GUILLERMO  MAHID ",
				"Teléfono": "5530091536",
				"Extensión": ""
			},
			{
				"Nombre": "GUILLERMO CHAHIEL KAREN AYALA",
				"Teléfono": "5530091536",
				"Extensión": ""
			},
			{
				"Nombre": "HERNALDO  ARROYO SUSTAITA",
				"Teléfono": "8183544596",
				"Extensión": ""
			},
			{
				"Nombre": "HIGINIO JUNIOR SANDOVAL LEAL",
				"Teléfono": "8117745465",
				"Extensión": ""
			},
			{
				"Nombre": "JOSE DE JESUS JIMENEZ MARTINEZ",
				"Teléfono": "8113981007",
				"Extensión": ""
			},
			{
				"Nombre": "LEONARD RUSSELL GREEN COLMENARES",
				"Teléfono": "8114884128",
				"Extensión": ""
			},
			{
				"Nombre": "LESLI  VERA HERNANDEZ",
				"Teléfono": "8111744473",
				"Extensión": ""
			},
			{
				"Nombre": "LUIS ANTONIO CALVILLO GUZMAN",
				"Teléfono": "8180263853",
				"Extensión": ""
			},
			{
				"Nombre": "LUIS GERARDO HERNANDEZ DE LA ROSA",
				"Teléfono": "8110400167",
				"Extensión": ""
			},
			{
				"Nombre": "LUIS GERARDO HERNANDEZ DE LA ROSA",
				"Teléfono": "8113468542",
				"Extensión": ""
			},
			{
				"Nombre": "LUIS RICARDO HERNANDEZ DE LA ROSA",
				"Teléfono": "8117368659",
				"Extensión": ""
			},
			{
				"Nombre": "MARIA DEL ROSARIO SOTO GONZALEZ",
				"Teléfono": "8183230759",
				"Extensión": ""
			},
			{
				"Nombre": "NELSON ISRAEL RODRIGUEZ SANCHEZ",
				"Teléfono": "8119564921",
				"Extensión": ""
			},
			{
				"Nombre": "ORLANDO RUBEN DE LA ROSA GARCIA",
				"Teléfono": "8110434346",
				"Extensión": ""
			},
			{
				"Nombre": "ROSALINDA  PEREZ PEÑA",
				"Teléfono": "8113943575",
				"Extensión": ""
			},
			{
				"Nombre": "ROSARIO  SOTO GONZALEZ",
				"Teléfono": "8119774281",
				"Extensión": ""
			},
			{
				"Nombre": "WILFRIDO  CANELA COSS",
				"Teléfono": "8130928308",
				"Extensión": ""
			},
			{
				"Nombre": "XIMENA SOPHIA MUÑOZ VERA",
				"Teléfono": "8113468542",
				"Extensión": ""
			}
		]
	}
};
