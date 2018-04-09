// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.iniciarSesion.addEventListener('click', function(error) {
	login();
	var validacion = Alloy.createController("validacionLogin");
	validacion = validacion.getView();
	validacion.open();

});

function login(idColaborador, password) {

	var colaborador = {
		idColaborador : '123456',
		nombre : 'Colaborador Sorteos Tec',
		telefono : '1234567890',
		direccion : 'calle 1, numero 1234'
	};

	var Datoscolaborador = Alloy.createModel('modeloColaborador', {
		idColaborador : '123456',
		nombre : 'Colaborador Sorteos Tec',
		telefono : '1234567890',
		direccion : 'calle 1, numero 1234'
	});
	Datoscolaborador.save();
	Alloy.Collections.colaborador.push(Datoscolaborador);

	Ti.API.info(JSON.stringify(Alloy.Collections.colaborador,null,4));
	return colaborador;
	
				
}
