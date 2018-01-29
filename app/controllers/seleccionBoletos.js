// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.cancelar.addEventListener('click', function(error) {
	var validacion = Alloy.createController("detalleCliente");
	validacion = validacion.getView();
	validacion.open();

});

$.botonMas.addEventListener('click', function(error) {
	$.cantidadBoletos.text = parseInt($.cantidadBoletos.text) + 1;

});

$.botonMenos.addEventListener('click', function(error) {
	if (parseInt($.cantidadBoletos.text) > 1) {
		$.cantidadBoletos.text = parseInt($.cantidadBoletos.text) - 1;
	}
}); 

obtenerImagenes();


function obtenerImagenes() {
	Alloy.Globals.Cloud.PhotoCollections.showPhotos({
		collection_id : "5a6b839824ee48c54b8ecad7"
	}, function(e) {
		if (e.success) {
			if (!e.photos) {
				//agregar mensaje de que no hay sorteos activos
			} else {
				Alloy.Collections.menuPrincipal.reset();
				e.photos.forEach(function(photo) {
					var sorteo = Alloy.createModel('modeloSorteo', {
						activo : photo.custom_fields.activo,
						fecha : photo.custom_fields.fecha,
						numeroSorteo : photo.custom_fields.numeroSorteo,
						original : photo.urls.original,
						miniatura :  photo.urls.original,
						nombreSorteo : ''
						
					});
					sorteo.save();
					Alloy.Collections.sorteosActivos.push(sorteo);
				});
				Ti.API.info(JSON.stringify(sorteo,null,4));
				crearListaSorteos(Alloy.Collections.menuPrincipal.where({
					activo : true
				}));
			}
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function crearListaSorteos(sorteos) {
	//var menuActivo = Alloy.Collections.menuPrincipal.where({activo : true});
	//Ti.API.info(JSON.stringify(menuActivo,null,4));
	sorteos.sort().forEach(function(opcion) {
		//Ti.API.info(JSON.stringify(opcion.get('pantalla'),null,4));
		var sorteo = Titanium.UI.createImageView({
			image : opcion.get('original'),
			id : opcion.get('pantalla'),
			top : '5',
			left : '10',
			right : '10'
			
		});
		menu.addEventListener('click', clickMenu);
		
		sorteo.width = 200;
		sorteo.height = sorteo.width * .4;

		$.vistaSeleccionarSorteo.add(sorteo);

	});
}