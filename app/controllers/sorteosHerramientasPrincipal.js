// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
/*
crearListaSorteos(Alloy.Collections.sorteosActivos.where({
activo : '1'
}));*/

//obtenerImagenesSorteos();

$.vistaPremios.height = 300;
listaDeGalerias();
crearListaMensajes();
//muestraGaleria('5b18a36e93fb030220038efa');
$.home.addEventListener('click', function(error) {

	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();

});

$.vistaSorteosActivos.addEventListener('scrollend', seleccionaGaleria);

function seleccionaGaleria() {
	try {
		var indice = $.vistaSorteosActivos.currentPage;
		var viewArray = $.vistaSorteosActivos.getViews();
		var idGaleria = viewArray[indice].idGaleria;
		if(viewArray.length > 0) {
			muestraGaleria(idGaleria);

		}
	} catch(err) {
	}
}


function muestraGaleria(idCollection) {
	Alloy.Globals.Cloud.PhotoCollections.showPhotos({
		collection_id : idCollection//collection.id
		//5a4e90755a276e961e1f55f6
	}, function(e) {
		if(e.success) {
			if(!e.photos) {
				//alert('Success: No photos');
			} else {
				var paginasGaleria = [];
				//Ti.API.info(JSON.stringify(e.photos.sort(compare),null,4));
				e.photos.sort(compare).forEach(function(photo) {
					Ti.API.info('photo:' + JSON.stringify(photo, null, 4));
					var imagenPremio = Titanium.UI.createImageView({
						id : 'imagenPremio',
						image : photo.urls.original,
						top : 5,
						nombreArchivo : photo.filename

					});

					var vistaPremio = Titanium.UI.createView({
						background : "white"
					});
					vistaPremio.add(imagenPremio);

					paginasGaleria.push(vistaPremio);
				});
				$.vistaPremios.views = paginasGaleria;

				//crearMenuOpciones(Alloy.Collections.menuPrincipal.where({
				//	activo : true
				//}));
			}
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}


function listaDeGalerias() {
	Alloy.Globals.Cloud.PhotoCollections.showSubcollections({
		page : 1,
		per_page : 20,
		collection_id : '5a57d3521ceda35a3b5c74eb'
	}, function(e) {
		if(e.success) {
			var paginas = [];

			Ti.API.info('Success:\n' + 'Count: ' + e.collections.length);
			var galerias = [];
			for(var i = 0; i < e.collections.length; i++) {
				var collection = e.collections[i];
				//Ti.API.info('collection:' + JSON.stringify(collection, null, 4));
				if(collection.counts.photos > 0 && collection.custom_fields.activo) {
					galerias.push({
						nombre : collection.name,
						idCover : collection.cover_photo_id,
						idGaleria : collection.id
					});
				}
			}
			//Ti.API.info('galerias:' + JSON.stringify(galerias, null, 4));
			galerias.forEach(function(galeria) {
				Alloy.Globals.Cloud.Photos.show({
					photo_id : galeria.idCover
				}, function(f) {
					if(f.success) {
						var photo = f.photos[0];
						//Ti.API.info('photo:' + JSON.stringify(photo, null, 4));
						//Ti.API.info('galeria:' + JSON.stringify(galeria, null, 4));
						var imagenSorteo = Titanium.UI.createImageView({
							id : 'imagenGaleria',
							image : photo.urls.original,
							top : '10',
							left : '10%',
							bottom : '10',
							right : '10',
							width : '80%',

						});

						var vistaSorteo = Titanium.UI.createView({
							background : "blue",
							idGaleria : galeria.idGaleria
						});
						vistaSorteo.add(imagenSorteo);

						paginas.push(vistaSorteo);
						$.vistaSorteosActivos.views = paginas;
					}
				});
			});
			$.vistaSorteosActivos.views = paginas;
			//Ti.API.info('paginas:' + JSON.stringify(paginas, null, 4));
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
		setTimeout(function() {
			$.vistaSorteosActivos.setCurrentPage(0);
			seleccionaGaleria();
		}, 1000);
	});
}


function crearListaSorteos(sorteos) {
	var menuActivo = Alloy.Collections.menuPrincipal.where({
		activo : true
	});
	$.vistaSorteosActivos.removeAllChildren();
	//Ti.API.info(JSON.stringify(sorteos, null, 4));
	var paginas = [];
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	sorteos.sort().forEach(function(opcion) {
		//Ti.API.info(JSON.stringify(opcion,null,4));

		var imagenSorteo = Titanium.UI.createImageView({
			image : opcion.get('original'),
			top : '10',
			left : '40',
			right : '40',
			bottom : "10",
			width : '70%',
			background : "blue"

		});

		var vistaSorteo = Titanium.UI.createView({
			background : "blue",
			left : '10',
			right : '10',
		});
		vistaSorteo.add(imagenSorteo);

		paginas.push(vistaSorteo);

	});
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	$.vistaSorteosActivos.views = paginas;

}


function removeAllChildren(viewObject) {
	//copy array of child object references because view's "children" property is
	// live collection of child object references
	var children = viewObject.children.slice(0);

	for(var i = 0; i < children.length; ++i) {
		viewObject.remove(children[i]);
	}
}


function compare(a, b) {
	if(a.filename < b.filename)
		return -1;
	if(a.filename > b.filename)
		return 1;
	return 0;
}


$.compartirImagen.addEventListener('click', function() {
	var indice = $.vistaPremios.currentPage;
	var viewArray = $.vistaPremios.getViews();
	var vistaImagen = viewArray[indice].getViewById('imagenPremio');

	if(OS_ANDROID && i.Filesystem.isExternalStoragePresent()) {
		var img = vistaImagen.toImage().media;
		fileToShare = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDeirectory, vistaImagen.nombreArchivo);
	} else {
		var img = $.newimage.toImage();
		fileToShare = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, vistaImagen.nombreArchivo);
	}
	fileToShare.write(img);

	var downloadingFileUrl = vistaImagen.image;
	Ti.API.info('imagen:' + downloadingFileUrl);

	/*
	 var xhr = Titanium.Network.createHTTPClient({
	 onload : function() {

	 if(Ti.Filesystem.isExternalStoragePresent()) {
	 var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,
	 vistaImagen.nombreArchivo);
	 }// No SD or iOS
	 else {
	 var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
	 vistaImagen.nombreArchivo);
	 }
	 // Save file
	 file.write(this.responseData);
	 Ti.API.info(file.toString());
	 // Debug: Test if file exist now
	 if(file.exists) {
	 //alert('[saveFile] Saved: YES! (' + file.nativePath + ')');
	 share({
	 file : file
	 });

	 } else {
	 Ti.API.info('[saveFile] Saved: NO!');
	 }

	 },
	 timeout : 10000
	 });
	 xhr.open('GET',
	 'https://s3-us-west-1.amazonaws.com/storage-platform.cloud.appcelerator.com/VsCFrroIecox2cc1mCb7lsuTtmQFX4zn/photos/c4/a4/5b1aa9d7b75a6531400079c9/se_1_original.jpg');
	 xhr.send();

	 */

});

$.descargarImagen.addEventListener('click', function() {

	/*var indice = $.vistaPremios.currentPage;
	 var viewArray = $.vistaPremios.getViews();
	 var vistaImagen = viewArray[indice].getViewById('imagenPremio');

	 Ti.API.info(JSON.stringify(vistaImagen.image, null, 4));
	 var downloadingFileUrl = vistaImagen.image;

	 var imagen = vistaImagen.toImage();
	 guardarArchivo(imagen, 'imagen.png');
	 */
	Ti.API.info('guardar');
	var img = $.iv.toBlob();
	Titanium.Media.saveToPhotoGallery(img, {
		"success" : function(e) {
			alert('Saved to your camera roll.');
		},
		"error" : function(e) {
			alert(e.error);
		}
	});

});

function guardarArchivo(file, filename) {
	Ti.API.info('guardarArchivo');
	// OS
	if(Ti.Platform.osname === 'iPhone' || Ti.Platform.osname === 'iPad') {
		var ios = true;
	}

	// Test if External Storage (Android only)
	if(Ti.Filesystem.isExternalStoragePresent()) {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, filename);
	}
	// No SD or iOS
	else {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, filename);
	}

	// Save file
	file.write(file);

	// Debug: Test if file exist now
	if(file.exists) {
		Ti.API.info('[saveFile] Saved: YES! (' + file.nativePath + ')');

	} else {
		Ti.API.info('[saveFile] Saved: NO!');
	}

	// Return full path of file
	if(ios && Ti.version <= '1.8.2') {
		var iosPath = Ti.Filesystem.applicationDataDirectory + filename;
		iosPath = iosPath.replace('file://', 'app://');

		return iosPath;
	} else {
		return file.nativePath;
	}

}


function share(options) {

	if(OS_ANDROID) {

		var intent = Ti.Android.createIntent({
			action : Ti.Android.ACTION_SEND
		});

		intent.putExtra(Ti.Android.EXTRA_SUBJECT, options.title);

		if(options.link) {
			intent.putExtra(Ti.Android.EXTRA_TEXT, options.link);
		}

		if(options.text) {

			intent.putExtra(Ti.Android.EXTRA_TEXT, options.text);
		}

		if(options.image) {
			intent.putExtraUri(Ti.Android.EXTRA_STREAM, options.image.nativePath);
		}

		if(options.file) {
			//alert(options.file.nativePath);
			intent.putExtraUri(Ti.Android.EXTRA_STREAM, options.file.nativePath);
		}

		var share = Ti.Android.createIntentChooser(intent, 'Delen');

		Ti.Android.currentActivity.startActivity(share);

	}
}


function crearListaMensajes() {

	$.vistaListaMensajes.removeAllChildren();
	//Ti.API.info(JSON.stringify(sorteos, null, 4));
	var paginas = [];
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	Alloy.Globals.listaMensajes.forEach(function(mensaje) {
		Ti.API.info('mensajes:' + JSON.stringify(mensaje, null, 4));
		//Ti.API.info(JSON.stringify(opcion,null,4));
		var mensaje = Titanium.UI.createImageView({
			image : mensaje.icono,
			top : '10',
			left : '10',
			right : '10',
			bottom : "10",
			width : '80',
			background : "blue",
			mensaje : mensaje.texto

		});
		mensaje.addEventListener('click', function(e) {
			//Ti.API.info(JSON.stringify(e, null, 4));
			share({
				text : e.source.mensaje
			});
		});

		$.vistaListaMensajes.add(mensaje);

	});
	//Ti.API.info(JSON.stringify('paginas:' + paginas, null, 4));

}
