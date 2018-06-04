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

$.cantidadBoletos.text = parseInt($.cantidadBoletos.boletos) + " Boletos";
Ti.API.info('crearListaSorteos sorteosActivos:' + JSON.stringify(Alloy.Collections.sorteosActivos, null, 4));

crearListaSorteos(Alloy.Collections.sorteosActivos.where({
	activo : 1
}));

$.regresar.addEventListener('click', function(error) {

	var inicio = Alloy.createController("detalleCliente", args);
	inicio = inicio.getView();
	inicio.open();

});

$.aceptar.addEventListener('click', function(error) {

	try {
		var indice = $.vistaSeleccionarSorteo.currentPage;
		var viewArray = $.vistaSeleccionarSorteo.getViews();
		detalle.boletos.push({
			"id" : viewArray[indice].getViewById('imagen').idImagen,
			"cantidad" : $.cantidadBoletos.boletos
		});
		detalle.pagoPendiente = detalle.pagoPendiente + (500 * $.cantidadBoletos.boletos);

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
	if(parseInt($.cantidadBoletos.text) > 1) {
		$.cantidadBoletos.boletos = parseInt($.cantidadBoletos.boletos) - 1;
		$.cantidadBoletos.text = parseInt($.cantidadBoletos.boletos) + " Boletos";

	}
});

function crearListaSorteos(sorteos) {
	//var menuActivo = Alloy.Collections.menuPrincipal.where({activo : true});
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	Ti.API.info('crearListaSorteos sorteos:' + JSON.stringify(sorteos, null, 4));
	var paginas = [];
	sorteos.sort().forEach(function(opcion) {
		Ti.API.info(JSON.stringify(opcion, null, 4));
		var imagenSorteo = Titanium.UI.createImageView({
			id : "imagen",
			image : opcion.get('original'),
			top : '50',
			left : '10',
			right : '10',
			idImagen : opcion.get('id')

		});

		var vistaSorteo = Titanium.UI.createView({
			background : "blue"
		});

		// "\uf058",
		var checkBox = Titanium.UI.createLabel({
			text : "\uf058",
			left : '80%',
			top : '17%',
			height : '50',
			width : '50',
			color : "#63dced",
			font : {
				fontSize : 40,
				fontFamily : 'FontAwesome'
			},
		});
		var fechaSorteo = Titanium.UI.createLabel({
			text : opcion.get('fechaFin'),
			left : '10%',
			right : '10%',
			top : '75%',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : "white",
			font : {
				fontSize : 20,
				fontFamily : 'Montserrat-Regular'
			},
		});
		var fondoCheckBox = Titanium.UI.createLabel({
			text : "\uf111",
			left : '80%',
			top : '17%',
			height : '50',
			width : '50',
			color : "white",
			font : {
				fontSize : 40,
				fontFamily : 'FontAwesome'
			},
		});
		vistaSorteo.add(imagenSorteo);
		vistaSorteo.add(fondoCheckBox);
		vistaSorteo.add(checkBox);
		vistaSorteo.add(fechaSorteo);

		paginas.push(vistaSorteo);
		//menu.addEventListener('click', clickMenu);

	});
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	$.vistaSeleccionarSorteo.views = paginas;

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
