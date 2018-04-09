// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

if (Alloy.Collections.sorteosActivos.count != 0) {
	obtenerImagenes();

} else {
	crearListaSorteos(Alloy.Collections.sorteosActivos.where({
		activo : true
	}));
}

$.home.addEventListener('click', function(error) {

	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();

});

function obtenerImagenes() {
	Alloy.Globals.Cloud.PhotoCollections.showPhotos({
		collection_id : "5a6b839824ee48c54b8ecad7"
	}, function(e) {
		if (e.success) {
			if (!e.photos) {
				//agregar mensaje de que no hay sorteos activos
			} else {
				Alloy.Collections.sorteosActivos.reset();
				e.photos.forEach(function(photo) {
					var sorteo = Alloy.createModel('modeloSorteo', {
						activo : photo.custom_fields.activo,
						fecha : photo.custom_fields.fecha,
						numeroSorteo : photo.custom_fields.numeroSorteo,
						original : photo.urls.original,
						miniatura : photo.urls.original,
						nombreSorteo : ''

					});
					sorteo.save();
					Alloy.Collections.sorteosActivos.push(sorteo);

				});
				//Ti.API.info(JSON.stringify(Alloy.Collections.sorteosActivos,null,4));
				crearListaSorteos(Alloy.Collections.sorteosActivos.where({
					activo : true
				}));
			}
		} else {
			//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function crearListaSorteos(sorteos) {
	//var menuActivo = Alloy.Collections.menuPrincipal.where({activo : true});
	//Ti.API.info(JSON.stringify(sorteos,null,4));
	var paginas = [];
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	sorteos.sort().forEach(function(opcion) {
		//Ti.API.info(JSON.stringify(opcion,null,4));
		var imagenSorteo = Titanium.UI.createImageView({
			image : opcion.get('original'),
			top : '10',
			left : '10',
			right : '10',
			bottom : "10"

		});

		var vistaSorteo = Titanium.UI.createView({
			background : "blue"
		});
		vistaSorteo.add(imagenSorteo);

		paginas.push(vistaSorteo);
		//menu.addEventListener('click', clickMenu);

	});
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	$.vistaSorteosActivos.views = paginas;

}

function removeAllChildren(viewObject) {
	//copy array of child object references because view's "children" property is live collection of child object references
	var children = viewObject.children.slice(0);

	for (var i = 0; i < children.length; ++i) {
		viewObject.remove(children[i]);
	}
}

