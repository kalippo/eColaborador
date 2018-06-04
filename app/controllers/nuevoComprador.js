// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
$.nuevo.color = "black";

$.nuevo.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(0);
});
$.frecuentes.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(1);
});
$.telefono.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(2);
});

$.vistaFiltros.addEventListener('scroll', function(e) {

	$.nuevo.color = "#6dace7";
	$.frecuentes.color = "#6dace7";
	$.telefono.color = "#6dace7";

	if(e.currentPage == 0) {
		$.nuevo.color = "black";
	} else if(e.currentPage == 1) {
		$.frecuentes.color = "black";
	} else if(e.currentPage == 2) {
		$.telefono.color = "black";
	}

});

$.regresar.addEventListener('click', regresar);

function regresar() {
	var validacion = Alloy.createController("misClientes");
	validacion = validacion.getView();
	validacion.open();
}


$.agregar.addEventListener('click', function(error) {
	var indice = $.vistaFiltros.currentPage;
	var viewArray = $.vistaFiltros.getViews();

	//Ti.API.info(JSON.stringify(indice, null, 4));

	if(indice == 0) {

		Alloy.Globals.contactos.push({
			"id" : Alloy.Globals.maxId,
			"nombreContacto" : viewArray[indice].getViewById('nombre').value + ' ' + viewArray[indice].getViewById('apellidos').value,
			"telefono" : viewArray[indice].getViewById('telefono').value,
			"pagoPendiente" : 0,
			"boletos" : [],
			"abonos" : [],
			"notas" : ""

		});
		//Ti.API.info(JSON.stringify(viewArray[indice].getViewById('nombre').value, null,
		// 4));
		//Ti.API.info(JSON.stringify(Alloy.Globals.contactos, null, 4));
		//guardarContactos();
		Alloy.Globals.maxId++;
		Alloy.Globals.guardarContactos();
		//alerta('Contacto dado de alta ');

		regresar();
	} else if(indice == 1 || indice == 2) {
		//Ti.API.info(JSON.stringify(viewArray[indice].getViewById('listaFrecuentes')
		// ,null,4));
		var list = viewArray[indice].getViewById('listaContactos');
		//Ti.API.info(JSON.stringify(list.sections[0].getItems(),null,4));
		list.sections[0].getItems().forEach(function(contacto) {
			if(contacto.seleccionado.value == 1) {
				//Ti.API.info(JSON.stringify(contacto, null, 4));
				Alloy.Globals.contactos.push({
					"id" : Alloy.Globals.maxId,
					"nombreContacto" : contacto.nombreContacto.text,
					"telefono" : contacto.telefono.text,
					"pagoPendiente" : 0,
					"boletos" : [],
					"abonos" : [],
					"notas" : ""

				});
				Alloy.Globals.maxId++;
				//guardarContactos();
			}
		});
		Alloy.Globals.guardarContactos();
		//alerta('Contactos importados correctamente');
		regresar();

	}
});

function guardarContactos() {
	Alloy.Globals.contactos.sort(function(a, b) {
		var keyA = a.nombreContacto,
		    keyB = b.nombreContacto;
		if(keyA < keyB)
			return -1;
		if(keyA > keyB)
			return 1;
		return 0;
	});
	Ti.API.info(JSON.stringify(Alloy.Globals.contactos, null, 4));
	Ti.App.Properties.setList('listaContactos', Alloy.Globals.contactos);
	Alloy.Globals.maxId = Alloy.Globals.maxId + 1;
	Ti.App.Properties.setInt('maxId', Alloy.Globals.maxId);
	Ti.API.info(Alloy.Globals.maxId);
}


function alerta(texto) {
	setTimeout(function() {
		var dialog = Titanium.UI.createAlertDialog({
			title : 'Sorteos Tec',
			message : texto,
			//persistent : true,
			buttonNames : ["OK"]
		});
		dialog.show();
	}, 4000);
	dialog.show();
}
