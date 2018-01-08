// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.imagenMisClientes.addEventListener('click', function(error) {

	var validacion = Alloy.createController("misClientes");
	validacion = validacion.getView();
	validacion.open();
});

$.vistaMenu.addEventListener('click', function(error) {

	Alloy.Globals.toggleMenu();

});

$.imagenEstadoCuenta.addEventListener('click', function(error) {
	var validacion = Alloy.createController("notificacionLogin");
	validacion = validacion.getView();
	validacion.open();
});

$.imagenSorteosHerramientas.addEventListener('click', function(error) {
	var validacion = Alloy.createController("sorteosHerramientasPrincipal");
	validacion = validacion.getView();
	validacion.open();
});

var altura = Math.trunc($.imagenMisClientes.width * .4);

$.imagenMisClientes.height = altura;
$.imagenEstadoCuenta.height = altura;
$.imagenSorteosHerramientas.height = altura;
$.imagenCobroMovil.height = altura;
$.imagenConsultaGanadores.height = altura;

Alloy.Globals.Cloud.PhotoCollections.showPhotos({
	collection_id : "5a4e90755a276e961e1f55f6"
}, function(e) {
	if (e.success) {
		if (!e.photos) {
			alert('Success: No photos');
		} else {
			Alloy.Collections.menuPrincipal.reset();
			
			e.photos.forEach(function(photo) {
				
				var modeloMenu = Alloy.createModel('modeloMenuPrincipal'
												,{activo: 1
												,pantalla: 'photo.pantalla'
												,indice: 1
												,original: 'photo.urls.original'});
				Alloy.Collections.menuPrincipal.add(modeloMenu);
				Ti.API.info(modeloMenu);
				
				var menu = Titanium.UI.createImageView({
					image : photo.urls.original,
					id : photo.custom_fields.pantalla,
					top : '5',
					left : '5',
					right : '5',
					pantallaDestino : photo.custom_fields.pantalla
				});
				menu.addEventListener('click',clickMenu);
				menu.width  = 350;
				menu.height = menu.width *.4;
				$.vistaPanel.add(menu);
				
			});
		}
	} else {
		alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	}
});



function clickMenu(){
	if (this.pantallaDestino != 'blank'){
		var validacion = Alloy.createController(this.pantallaDestino);
			validacion = validacion.getView();
			validacion.open();
	}
}

Ti.API.info('xxx');
Ti.API.info(JSON.stringify(Alloy.Collections.menuPrincipal) );
