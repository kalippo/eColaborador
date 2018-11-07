// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
$.vistaProcesando.visible = true;
$.procesando.show();
/*
 crearListaSorteos(Alloy.Collections.sorteosActivos.where({
 activo : '1'
 }));*/
if(Ti.Platform.osname == 'android') {
	$.descargarImagen.visible = true;
	$.compartirImagen.visible = true;
} else {
	$.descargarImagen.visible = true;
	$.compartirImagen.visible = false;
}
//obtenerImagenesSorteos();
// Ti.API.info('x: ' + JSON.stringify($.vistaPremios.width, null, 4));
var anchoGaleria = Alloy.Globals.anchoPantalla();
// alert('ancho: ' + anchoGaleria);
$.vistaPremios.height = anchoGaleria;
$.vistaPremios.width = anchoGaleria;

//$.vistaPremios.width;
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

	$.vistaProcesando.visible = true;
	$.procesando.show();
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
					//Ti.API.info('photo:' + JSON.stringify(photo, null, 4));
					var imagenPremio = Titanium.UI.createImageView({
						id : 'imagenPremio',
						image : photo.urls.original,
						left : '0',
						right : '0',
						nombreArchivo : photo.filename

					});

					var vistaPremio = Titanium.UI.createView({
						background : "white"
					});
					vistaPremio.add(imagenPremio);

					paginasGaleria.push(vistaPremio);
				});
				$.vistaPremios.views = paginasGaleria;
				// Ti.API.info('x: ' + $.vistaPremios.width);
				$.procesando.hide();
				$.vistaProcesando.visible = false;
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

			// Ti.API.info('Success:\n' + 'Count: ' + e.collections.length);
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
			// Ti.API.info('galerias:' + JSON.stringify(galerias, null, 4));
			galerias.forEach(function(galeria) {
				Alloy.Globals.Cloud.Photos.show({
					photo_id : galeria.idCover
				}, function(f) {
					if(f.success) {
						var photo = f.photos[0];
						// Ti.API.info('photo:' + JSON.stringify(photo, null, 4));
						// Ti.API.info('galeria:' + JSON.stringify(galeria, null, 4));

						var anchoImagen = 215;

						var vistaSorteo = Titanium.UI.createView({
							background : "blue",
							idGaleria : galeria.idGaleria
						});
						var imagenSorteo = Titanium.UI.createImageView({
							id : 'imagenGaleria',
							image : photo.urls.original,
							top : '5',
							//	left : margenIzquierdo,
							//bottom : '10',
							//	right : '10',
							width : anchoImagen,
							height : '111',

						});

						//var posicionCheck = margenIzquierdo + anchoImagen ;
						var checkBox = Titanium.UI.createLabel({
							text : "\uf058",
							//right : margenIzquierdo,
							top : 5,
							height : '50',
							width : '50',
							color : "#63dced",
							font : {
								fontSize : 40,
								fontFamily : 'FontAwesome'
							},
						});
						var fondoCheckBox = Titanium.UI.createLabel({
							text : "\uf111",
							//right : margenIzquierdo,
							top : 5,
							height : '50',
							width : '50',
							color : "white",
							font : {
								fontSize : 40,
								fontFamily : 'FontAwesome'
							},
						});

						vistaSorteo.add(imagenSorteo);
						//vistaSorteo.add(fondoCheckBox);
						//vistaSorteo.add(checkBox);

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
			width : '80%',
			heighth : '80%',
			background : "blue"

		});

		var vistaSorteo = Titanium.UI.createView({
			background : "blue",
			left : '10',
			right : '10',
			width : '80%',
			heighth : '80%',
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

	if(Ti.Platform.osname == 'android') {
		if(!Ti.Filesystem.hasStoragePermissions()) {
			Ti.Filesystem.requestStoragePermissions(function(result) {
				console.log('Permission granted? ' + result.success);
				if(result.success) {
					compatirArchivo();

				} else {
					alert('Permission denied.');
				}
			});
		} else {
			compatirArchivo();
		}
	}

});

function descargarArchivo() {
	var indice = $.vistaPremios.currentPage;
	var viewArray = $.vistaPremios.getViews();
	var vistaImagen = viewArray[indice].getViewById('imagenPremio');

	Ti.API.info(JSON.stringify(vistaImagen.image, null, 4));
	var downloadingFileUrl = vistaImagen.image;

	var xhr = Ti.Network.createHTTPClient({
		onerror : function() {
			alert('Error fetching profile image');
		},

		onload : function() {
			$.vistaProcesando.visible = true;
			$.procesando.show();
			// this.responseData holds the binary data fetched from url
			Ti.API.info('ur:' + downloadingFileUrl);
			Ti.API.info('archivo:' + vistaImagen.nombreArchivo);
			var image_to_save = this.responseData;

			//As name, the same as the one in DB
			var picture = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, vistaImagen.nombreArchivo);
			//picture.write(image_to_save);
			if(picture.exists) {
				Ti.API.info('local:' + picture.nativePath);

				//alert('[saveFile] Saved: YES! (' + file.nativePath + ')');

				//alert('permiso para galeria');
				if(Ti.Platform.osname == 'android') {
					Ti.API.info("ANDROID");
					var storagePermission = "android.permission.WRITE_EXTERNAL_STORAGE";
					var hasStoragePerm = Ti.Android.hasPermission(storagePermission);
					var permissionsToRequest = [];
					Ti.API.info(hasStoragePerm);
					if(hasStoragePerm) {
						Ti.Media.saveToPhotoGallery(vistaImagen.toImage(), {
							success : function() {
								alert('Imagen descargada correctamente a tu galería');
							},
							error : function() {
								alert('Error al descargar la imagen');
							}
						});
					} else {

						permissionsToRequest.push(storagePermission);
						if(permissionsToRequest.length > 0) {
							Ti.API.info("si tiene permiso");

							Ti.Android.requestPermissions(permissionsToRequest, function(e) {
								if(e.success) {
									Ti.API.info("SUCCESS");
									Ti.Media.saveToPhotoGallery(vistaImagen.toImage(), {
										success : function() {
											alert('Imagen descargada correctamente a tu galería');
										},
										error : function() {
											alert('Error al descargar la imagen');
										}
									});
								} else {
									Ti.API.info("ERROR: " + e.error);
									alert('No se cuenta con permisos en Android para decargar imagenes');

								}
							});
						}
					}

				} else if(!Ti.Media.hasPhotoGalleryPermissions()) {
					Ti.Media.requestPhotoGalleryPermissions(function(e) {
						if(e.succes) {
							Ti.Media.saveToPhotoGallery(vistaImagen.toImage(), {
								success : function() {
									alert('Imagen descargada correctamente a tu galería');
								},
								error : function() {
									alert('Error al descargar la imagen');
								}
							});
						}
					});
				}

			}
			//Ti.App.Properties.setString("user_picture_name", res.profil_picture);

			image_to_save = null;
			$.vistaProcesando.visible = false;
			$.procesando.hide();
		}
	});

	xhr.open("GET", downloadingFileUrl);
	xhr.send();
}


function compatirArchivo() {
	var indice = $.vistaPremios.currentPage;
	var viewArray = $.vistaPremios.getViews();
	var vistaImagen = viewArray[indice].getViewById('imagenPremio');

	Ti.API.info(JSON.stringify(vistaImagen.image, null, 4));
	var downloadingFileUrl = vistaImagen.image;

	var xhr = Ti.Network.createHTTPClient({
		onerror : function() {
			alert('Error fetching profile image');  
		},

		onload : function() {
			// this.responseData holds the binary data fetched from url
			Ti.API.info('ur:' + downloadingFileUrl);
			Ti.API.info('archivo:' + vistaImagen.nombreArchivo);
			var image_to_save = this.responseData;

			//As name, the same as the one in DB
			var picture = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, vistaImagen.nombreArchivo);
			picture.write(image_to_save);
			if(picture.exists) {
				Ti.API.info('local:' + picture.nativePath);

				//alert('[saveFile] Saved: YES! (' + file.nativePath + ')');
				share({
					file : picture
				});
			}
			//Ti.App.Properties.setString("user_picture_name", res.profil_picture);

			image_to_save = null;
		}
	});

	xhr.open("GET", downloadingFileUrl);
	xhr.send();
}


$.descargarImagen.addEventListener('click', function() {
	if(Ti.Platform.osname == 'android') {
		if(!Ti.Filesystem.hasStoragePermissions()) {
			Ti.Filesystem.requestStoragePermissions(function(result) {
				console.log('Permission granted? ' + result.success);
				if(result.success) {
					descargarArchivo();

				} else {
					alert('Permission denied.');
				}
			});
		} else {
			descargarArchivo();
		}
	} else {
		descargarArchivo();
	}

});

function guardarArchivo(file, filename) {
	Ti.API.info('guardarArchivo');
	var indice = $.vistaPremios.currentPage;
	var viewArray = $.vistaPremios.getViews();
	var vistaImagen = viewArray[indice].getViewById('imagenPremio');

	var picture = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, res.profil_picture);
	//As name, the same as the one in DB
	picture.write(vistaImagen);

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

	} else {
		if(options.text) {
			var text = encodeURIComponent(options.text);
			Ti.API.info(text);
			Ti.Platform.openURL("https://wa.me/?text=" +text);
			
			
			// var Social = require('dk.napp.social');
// 
			// Ti.API.info("Facebook available: " + Social.isFacebookSupported());
			// Ti.API.info("Twitter available: " + Social.isTwitterSupported());
			

			// require('com.alcoapps.socialshare').share({
			// status : options.text,
			//
			// androidDialogTitle : 'Sorteos Tec'
			// });
		}
		
		
	}
}


function crearListaMensajes() {

	$.vistaListaMensajes.removeAllChildren();
	//Ti.API.info(JSON.stringify(sorteos, null, 4));
	var paginas = [];
	Ti.API.info('mensajes: '+JSON.stringify(Alloy.Globals.listaMensajes, null, 4));
	Alloy.Globals.listaMensajes.forEach(function(mensaje) {
		 Ti.API.info('mensajes:' + JSON.stringify(mensaje, null, 4));
		//Ti.API.info(JSON.stringify(opcion,null,4));
		var mensaje = Titanium.UI.createImageView({
			image : mensaje.icono,
			top : '10',
			left : '15',
			right : '15',

			width : '70',
			height : '70',
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
