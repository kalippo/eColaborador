// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
//var args = arguments[0] || {};

//Ti.API.info(JSON.stringify(Alloy.Globals.Datoscolaborador,null,4));

llenaDatosColaborador();

$.imagenColaborador.addEventListener("click", function(e) {
	/* abrir la galeria del telefono

	 //Open the photo gallery
	 Titanium.Media.openPhotoGallery({
	 //function to call upon successful load of the gallery
	 success : function(e) {
	 //e.media represents the photo or video
	 var imageView = Titanium.UI.createImageView({
	 image : e.media,
	 width : 320,
	 height : 480,
	 top : 12,
	 zIndex : 1
	 });

	 win.add(imageView);
	 },
	 error : function(e) {
	 alert("There was an error");
	 },
	 cancel : function(e) {
	 alert("The photo gallery was cancelled");
	 },
	 //Allow editing of media before success
	 allowEditing : true,
	 //Media types to allow
	 mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	 //The other is Titanium.Media.MEDIA_TYPE_VIDEO
	 });
	 */
});

$.cancelar.addEventListener('click', function(error) {

	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
});

$.aceptar.addEventListener('click', function(error) {

	if($.correoColaborador.value == '' || $.telefonoColaborador.value == '' || $.nombreColaborador.value == '') {
		var dialog = Ti.UI.createAlertDialog({

			buttonNames : ['Ok'],
			message : 'Ningun campo puede ir en blanco',
			title : 'Error de guardado'
		});
		dialog.show();
	} else {
		var correoValido = validarCorreo($.correoColaborador.value);
		var telefonoValido = validarTelefono($.telefonoColaborador.value);

		if(correoValido) {
			if(telefonoValido) {
				Alloy.Globals.actualizarLogin($.nombreColaborador.value, $.correoColaborador.value, $.telefonoColaborador.value, actualizado, errorActualizado);
			} else {
				var dialog = Ti.UI.createAlertDialog({

					buttonNames : ['Ok'],
					message : 'Favor de intruducir un numero telefónico válido',
					title : 'Error de guardado'
				});
				dialog.show();
			}
		} else {
			var dialog = Ti.UI.createAlertDialog({

				buttonNames : ['Ok'],
				message : 'Favor de intruducir un correo electronico válido',
				title : 'Error de guardado'
			});
			dialog.show();
		}
	}
});

function actualizado() {
	var dialog = Ti.UI.createAlertDialog({
		buttonNames : ['Ok'],
		message : 'datos actualizados correctamente',
		title : 'Actualizacion de datos'
	});
	dialog.show();
}


function errorActualizado() {
	var dialog = Ti.UI.createAlertDialog({
		buttonNames : ['Ok'],
		message : 'ha haido un error al actualziar los datos\nfavor de intentar de nuevo',
		title : 'Error en la actualización'
	});
	dialog.show();
}


function llenaDatosColaborador() {
	if(Alloy.Globals.colaborador == '') {
		$.nombreColaborador.value = '';
		$.correoColaborador.value = '';
		$.telefonoColaborador.value = '';
	} else {
		$.nombreColaborador.value = Alloy.Globals.colaborador.first_name;
		if(Alloy.Globals.colaborador.username + '@sorteostec.mx' == Alloy.Globals.colaborador.email) {
			$.correoColaborador.value = '';
		} else {
			$.correoColaborador.value = Alloy.Globals.colaborador.email;
		}
		$.telefonoColaborador.value = Alloy.Globals.colaborador.custom_fields.telefono;
	}
}


$.correoColaborador.addEventListener('change', habilitaGuardar);
$.nombreColaborador.addEventListener('change', habilitaGuardar);

function habilitaGuardar() {

	$.aceptar.enabled = !($.correoColaborador.value == '' || $.nombreColaborador.value == '');
	if($.aceptar.enabled) {
		$.aceptar.opacity = 1;
	} else {
		$.aceptar.opacity = .5;
	}
}


function validarCorreo(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}


function validarTelefono(telefono) {
	var re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
	return re.test(String(telefono).toLowerCase());
}