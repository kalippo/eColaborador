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

	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
});

function llenaDatosColaborador() {
	if(Alloy.Globals.colaborador == '') {
		$.nombreColaborador.text = '';
		$.correoColaborador.text = '';
		$.telefonoColaborador.text = '';
	} else {
		$.nombreColaborador.text = Alloy.Globals.colaborador.first_name;
		$.correoColaborador.text = Alloy.Globals.colaborador.email;
		$.telefonoColaborador.text = Alloy.Globals.colaborador.custom_fields.telefono;
	}
}
