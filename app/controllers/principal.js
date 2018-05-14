// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Alloy.Collections.menuPrincipal.comparator = function(model) {
	return model.get('indice');
};

 
obtenerImagenes();

function obtenerImagenes() {
	Alloy.Globals.Cloud.PhotoCollections.showPhotos({
		collection_id : "5a4e90755a276e961e1f55f6"
					   //5a4e90755a276e961e1f55f6
	}, function(e) {
		if (e.success) {
			if (!e.photos) {
				//alert('Success: No photos');
			}
			else {
				Alloy.Collections.menuPrincipal.reset();
				e.photos.forEach(function(photo) {
					var menus = Alloy.createModel('modeloMenuPrincipal', {
						activo : photo.custom_fields.activo,
						pantalla : photo.custom_fields.pantalla,
						indice : photo.custom_fields.indice,
						original : photo.urls.original
					});
					menus.save(); 
					Alloy.Collections.menuPrincipal.push(menus);
				});
				//Ti.API.info(JSON.stringify(Alloy.Collections.menuPrincipal,null,4));
				crearMenuOpciones(Alloy.Collections.menuPrincipal.where({
					activo : true
				}));
			}
		}
		else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function crearMenuOpciones(menuActivo) {
	//var menuActivo = Alloy.Collections.menuPrincipal.where({activo : true});
	//Ti.API.info(JSON.stringify(menuActivo,null,4));
	menuActivo.sort().forEach(function(opcion) {
		//Ti.API.info(JSON.stringify(opcion.get('pantalla'),null,4));
		var menu = Titanium.UI.createImageView({
			image : opcion.get('original'),
			id : opcion.get('pantalla'),
			top : '5',
			left : '0',
			right : '0',
			pantallaDestino : opcion.get('pantalla')
		});
		menu.addEventListener('click', clickMenu);

		var anchoPantalla = Ti.Platform.displayCaps.platformWidth ;

		if (Ti.Platform.osname == 'android') {
			anchoPantalla = pixelToDp(anchoPantalla);
		} 
		menu.width = anchoPantalla;
		menu.height = menu.width * .4;

		$.vistaPanel.add(menu);
	});
}

// convert dp to pixel.
function dpToPixel(dp) {
    return ( parseInt(dp) * (Titanium.Platform.displayCaps.dpi / 160));
}

// convert pixel to dp.
function pixelToDp(px) {
    return ( parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}


$.iconoMenu.addEventListener('click', function() {
	
	Alloy.Globals.toggleMenu();    
});

function clickMenu() {
	if (this.pantallaDestino != 'blank') {
		var validacion = Alloy.createController(this.pantallaDestino);
		validacion = validacion.getView();
		validacion.open();
	}
}

