// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
$.nuevo.color = "black";

if(Alloy.Globals.isiPhoneX()==true) {
	$.vistaTitulo.top = Alloy.Globals.margenNotch;
} else {

	$.vistaTitulo.top = "0"; 
}

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
		$.nuevo.color = "#666666";
		$.seleccion.left = "5%";
	} else if(e.currentPage == 1) {
		$.frecuentes.color = "#666666";
		$.seleccion.left = "35%";
	} else if(e.currentPage == 2) {
		$.telefono.color = "#666666";
		$.seleccion.left = "65%";
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
		if(viewArray[indice].getViewById('nombre').value.trim() == '' ) {
			var dialog = Ti.UI.createAlertDialog({

			buttonNames : ['Ok'],
			message : 'El nombre no puede ir vacio',
			title : 'Alta de comprador'
		});
		dialog.show();
		} else if(viewArray[indice].getViewById('telefono').value.trim() == '') {
			var dialog = Ti.UI.createAlertDialog({

			buttonNames : ['Ok'],
			message : 'favor de escribir un numero telefonico',
			title : 'Alta de comprador'
		});
		dialog.show();
		} else{

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
		}
	} else if(indice == 1 || indice == 2) {
		//Ti.API.info(JSON.stringify(viewArray[indice].getViewById('listaFrecuentes'),null,4));
		var list = viewArray[indice].getViewById('listaContactos');
		Ti.API.info('lista:'+JSON.stringify(list.sections[0].getItems(),null,4));
		list.sections[0].getItems().forEach(function(contacto) {
		Ti.API.info('contacto activo:'+JSON.stringify(contacto.seleccionado.value ,null,4));
		Ti.API.info('contacto disponible:'+JSON.stringify(contacto.seleccionado.enabled ,null,4));
			if(contacto.seleccionado.value == 1 && contacto.seleccionado.enabled == 1) {
				Ti.API.info('contacto:'+JSON.stringify(contacto, null, 4));
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
