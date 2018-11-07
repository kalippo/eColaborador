// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

Ti.API.info(JSON.stringify(args, null, 4));
//$.botonMas.height = $.botonMas.width;
Alloy.Globals.contactos.forEach(function(contacto) {
	if(contacto.id == args) {
		detalle = contacto;
	}
});

var win = Titanium.UI.currentWindow; 

$.win.addEventListener('android:back', function(e) {
    e.cancelBubble = true;

    // Ti.App.fireEvent('android_back_button');
});

$.cantidadBoletos.text = parseInt($.cantidadBoletos.boletos) + " Boletos";

Ti.API.info('crearListaSorteos sorteosActivos:' + JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));

crearListaSorteos(Alloy.Collections.sorteosActivos.where({
	activo : '1'
}));

$.regresar.addEventListener('click', function(error) {

	var inicio = Alloy.createController("detalleCliente", args);
	inicio = inicio.getView();
	inicio.open();

});

$.vistaSeleccionarSorteo.addEventListener('scrollend', actualizaCantidadBoletos);

function actualizaCantidadBoletos() {
	var indice = $.vistaSeleccionarSorteo.currentPage;
	var viewArray = $.vistaSeleccionarSorteo.getViews();
	var cantidad = viewArray[indice].getViewById('imagen').cantidad;
	Ti.API.info(cantidad);
	$.cantidadBoletos.text = cantidad + " Boletos";
	$.cantidadBoletos.boletos = cantidad;
	$.cantidadBoletos.anterior = cantidad;
}


$.aceptar.addEventListener('click', function(error) {

	try {
		var indice = $.vistaSeleccionarSorteo.currentPage;
		var viewArray = $.vistaSeleccionarSorteo.getViews();
		var idSorteo = viewArray[indice].getViewById('imagen').idImagen;
		var sorteo = Alloy.Collections.sorteosActivos.where({
		id : idSorteo
		})[0];
		Ti.API.info('sorteo:' + JSON.stringify(sorteo, null, 4));
		Ti.API.info(parseInt(sorteo.get('precioUnitario')));

		var encontrado = false;
		for( i = 0; i < detalle.boletos.length; i++) {
			if(detalle.boletos[i].id == idSorteo) {
				detalle.boletos[i].cantidad = $.cantidadBoletos.boletos;
				encontrado = true;
			}
		}
		if(!encontrado) {
			detalle.boletos.push({
				"id" : idSorteo,
				"cantidad" : $.cantidadBoletos.boletos
			});
		}

		var diferenciaBoletos = $.cantidadBoletos.boletos - $.cantidadBoletos.anterior;
		Ti.API.info('anterior :' + $.cantidadBoletos.anterior);
		Ti.API.info('nuevo:' + $.cantidadBoletos.boletos);
		Ti.API.info('diferencia:' + diferenciaBoletos);

		detalle.pagoPendiente = detalle.pagoPendiente + (parseInt(sorteo.get('precioUnitario')) * diferenciaBoletos);

		var newContactos = Alloy.Globals.contactos.filter(function(e) {
			return e !== detalle;
		});

		newContactos.push(detalle);
		Alloy.Globals.contactos = newContactos;
		Alloy.Globals.guardarContactos();
		Ti.App.Properties.setList('listaContactos', Alloy.Globals.contactos);
	} catch (err) {
		alert('Error al ingresar el boleto, favor de intentar de nuevo');
	}
	var inicio = Alloy.createController("detalleCliente", args);
	inicio = inicio.getView();
	inicio.open();

});

$.botonMas.addEventListener('click', function(error) {
	$.cantidadBoletos.boletos = parseInt($.cantidadBoletos.boletos) + 1;
	$.cantidadBoletos.text = parseInt($.cantidadBoletos.boletos) + " Boletos";

});

$.botonMenos.addEventListener('click', function(error) {
	if(parseInt($.cantidadBoletos.text) >= 1) {
		$.cantidadBoletos.boletos = parseInt($.cantidadBoletos.boletos) - 1;
		$.cantidadBoletos.text = parseInt($.cantidadBoletos.boletos) + " Boletos";

	}
});

function crearListaSorteos(sorteos) {
	//var menuActivo = Alloy.Collections.menuPrincipal.where({activo : true});
	Ti.API.info(JSON.stringify(sorteos, null, 4));
	Ti.API.info('crearListaSorteos sorteos:' + JSON.stringify(sorteos, null, 4));
	var paginas = [];
	sorteos.sort().forEach(function(opcion) {
		var cantidad = 0;
		detalle.boletos.forEach(function(boleto) {
			Ti.API.info('boleto:' + boleto.id.toString());
			if(boleto.id.toString() == opcion.get('id').toString()) {
				cantidad = boleto.cantidad;
			}
		});

		Ti.API.info('sorteo:' + opcion.get('id').toString());
		Ti.API.info(JSON.stringify(cantidad, null, 4));
		
		var anchoImagen = 215;
		var anchoPantalla = Ti.Platform.displayCaps.platformWidth;

		if(Ti.Platform.osname == 'android') {
			anchoPantalla = Alloy.Globals.pixelToDp(anchoPantalla);
		}
		var margenIzquierdo = (anchoPantalla - anchoImagen) / 2;

		var imagenSorteo = Titanium.UI.createImageView({
			id : "imagen",
			image : opcion.get('original'),
			top : '50',
			//left : margenIzquierdo,
			width : anchoImagen,
			height : '111',
			idImagen : opcion.get('id'),
			cantidad : cantidad

		});

		var vistaSorteo = Titanium.UI.createView({
			background : "blue"
		});

		// "\uf058",
		var fechaSorteo = Titanium.UI.createLabel({
			text : opcion.get('fechaFin'),
			//left : '10%',
			//right : '10%',
			top : '130',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : "white",
			font : {
				fontSize : 15,
				fontFamily : 'Montserrat-Regular'
			},
		});
		var checkBox = Titanium.UI.createLabel({
			text : "\uf058",
			left : '70%',
			top : '20%',
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
			left : '70%',
			top : '20%',
			height : '50',
			width : '50',
			color : "white",
			font : {
				fontSize : 40,
				fontFamily : 'FontAwesome'
			},
		});
		vistaSorteo.add(imagenSorteo);
		// vistaSorteo.add(fondoCheckBox);
		// vistaSorteo.add(checkBox);
		vistaSorteo.add(fechaSorteo);

		paginas.push(vistaSorteo);
		//menu.addEventListener('click', clickMenu);

	});
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	$.vistaSeleccionarSorteo.views = paginas;
	actualizaCantidadBoletos();

}


function removeAllChildren(viewObject) {
	//copy array of child object references because view's "children" property is
	// live collection of child object references
	var children = viewObject.children.slice(0);

	for(var i = 0; i < children.length; ++i) {
		viewObject.remove(children[i]);
	}
}


function removeFromArray(array, item, index) {
	while(( index = array.indexOf(item)) > -1) {
		array.splice(index, 1);
	}
}
