// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

$.iniciarSesion.addEventListener('click', function(error) {
	login($.claveColaborador.value, $.password.value);
	var validacion = Alloy.createController("validacionLogin");
	validacion = validacion.getView();
	validacion.open();

});

function login(idColaborador, password) {

	Alloy.Globals.Cloud.Users.query({
		page : 1,
		per_page : 10,
		where : {
			username : idColaborador
		}
	}, function(e) {
		if(e.success) {
			if(e.users.length == 1) {
				//alert('Existe el usuario');
					login(idColaborador,password);
					actualizaDatosColaborador(e);
				
			} else {
				//alert('No existe ');

				// WS Login
				// Crear TI User
				Alloy.Globals.Cloud.Users.create({
					email : idColaborador + '@sorteostec.mx',
					username : idColaborador,
					first_name : idColaborador,
					last_name : idColaborador,
					password : password,
					password_confirmation : password,
					custom_fields : {
						compradores : '[]',
						telefono : '11111111',
						direccion : 'en algun lugar de un gran pais'
					}
				}, function(e) {
					if(e.success) {
						login(idColaborador,password);
						actualizaDatosColaborador(e);
					} else {
						Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});

			}

		}
	});

}


function login(idColaborador,password){
	Alloy.Globals.Cloud.Users.login({
					login : idColaborador,
					password : password
				}, function(e) {
					if(e.success) {
						
					} else {

						Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});
}


function actualizaDatosColaborador(e, password) {

	Alloy.Globals.Cloud.Users.showMe(function(e) {
		if(e.success) {

			var user = e.users[0];
			Ti.App.Properties.setString('login', user.username);
			Ti.App.Properties.setString('password', password);
			Ti.API.info('actualizaDatosColaborador.compradores: ' + JSON.stringify(user, null, 4));
			Alloy.Globals.colaborador = user;
			Alloy.Globals.compradores = JSON.parse(user.custom_fields.compradores);

		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}
