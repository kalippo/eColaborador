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

				Alloy.Globals.Cloud.Users.login({
					login : idColaborador,
					password : password
				}, function(e) {
					if(e.success) {
						//var user = e.users[0];
						//alert('Success:\n' + 'id: ' + user.id + '\n' + 'sessionId: ' + Cloud.sessionId
						// + '\n' + 'first name: ' + user.first_name + '\n' + 'last name: ' +
						// user.last_name);
						actualizaDatosColaborador(e, password);
					} else {

						alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});
			} else {
				//alert('No existe ');

				// WS Login
				// Crear TI User
				Alloy.Globals.Cloud.Users.create({
					email : 'pedro.miramontes@sorteostec.mx',
					username : idColaborador,
					first_name : 'Pedro',
					last_name : 'Miramontes',
					password : password,
					password_confirmation : password,
					custom_fields : {
						compradores : 'aaa',
						telefono : '81818181',
						direccion : 'en algun lugar de un gran pais'
					}
				}, function(e) {
					if(e.success) {

						actualizaDatosColaborador(e);
					} else {
						alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});

			}

		}
	});

}


function actualizaDatosColaborador(e, password) {   

	Cloud.Users.showMe(function(e) {
		if(e.success) {
			Ti.API.info(JSON.stringify(e.users[0], null, 4));
			Ti.App.Properties.setString('login', e.users[0].username);
			Ti.App.Properties.setString('password', password);
			var Datoscolaborador = Alloy.createModel('modeloColaborador', {
				idColaborador : e.username,
				nombre : e.first_name,
				telefono : e.telefono,
				direccion : e.direccion
			});
			Datoscolaborador.save();
			Alloy.Collections.colaborador.push(Datoscolaborador);

			Ti.API.info(JSON.stringify(Alloy.Collections.colaborador, null, 4));
			var user = e.users[0];
			alert('Success:\n' + 'id: ' + user.id + '\n' + 'first name: ' + user.first_name + '\n' + 'last name: ' + user.last_name);
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}
