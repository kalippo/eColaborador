// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//$.botonMas.height = $.botonMas.width;

$.cantidadBoletos.text = parseInt($.cantidadBoletos.boletos) + " Boletos";

obetnerSorteos();

if (Alloy.Collections.sorteosActivos.count !=0){
	obtenerImagenes();
	
}else{
	crearListaSorteos(Alloy.Collections.sorteosActivos.where({
					activo : true
			}));
}

$.regresar.addEventListener('click', function(error) {

	var inicio = Alloy.createController("detalleCliente");
	inicio = inicio.getView();
	inicio.open();

});


$.botonMas.addEventListener('click', function(error) {
	$.cantidadBoletos.boletos = parseInt($.cantidadBoletos.boletos) + 1;
	$.cantidadBoletos.text = parseInt($.cantidadBoletos.boletos) + " Boletos";


});

$.botonMenos.addEventListener('click', function(error) {
	if (parseInt($.cantidadBoletos.text) > 1) {
		$.cantidadBoletos.boletos = parseInt($.cantidadBoletos.boletos) - 1;
		$.cantidadBoletos.text = parseInt($.cantidadBoletos.boletos) + " Boletos";

	}
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
			top : '50',
			left : '10',
			right : '10'

		});
		
		var vistaSorteo = Titanium.UI.createView({
			background : "blue"
		});

// "\uf058",
var checkBox = Titanium.UI.createLabel({
		text : "\\uf058",
		left : '75%',
		top : '20%',
		height:'50',
		width : '50',
		font: { fontSize:40, fontFamily: 'MaterialIcons-Regular' },
});

		vistaSorteo.add(imagenSorteo);
		vistaSorteo.add(checkBox);
		paginas.push(vistaSorteo);
		//menu.addEventListener('click', clickMenu);


	});
		//Ti.API.info(JSON.stringify(paginas, null, 4));
		$.vistaSeleccionarSorteo.views = paginas;
	
}


function removeAllChildren(viewObject){
    //copy array of child object references because view's "children" property is live collection of child object references
    var children = viewObject.children.slice(0);
 
    for (var i = 0; i < children.length; ++i) {
        viewObject.remove(children[i]);
    }
}


function obetnerSorteos(){
	
	Alloy.Globals.Cloud.PhotoCollections.showSubcollections({
    	page: 1,
	    per_page: 20,
	    collection_id: "5a57d3521ceda35a3b5c74eb"
	}, function (e) {
	    if (e.success) {
	        for (var i = 0; i < e.collections.length; i++) {
	            var collection = e.collections[i];
	            Ti.API.info(JSON.stringify(collection, null, 4));
	        }
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
	
	
}

