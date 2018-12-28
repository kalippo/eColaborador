// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
var selectedId = 0;


if(Alloy.Globals.isiPhoneX()==true) {
	$.vistaTitulo.top = Alloy.Globals.margenNotch;
} else {

	$.vistaTitulo.top = "0"; 
}

getClientes();

$.seleccionarComprador.addEventListener('change', function() {
	$.vistaContactos.visible = $.seleccionarComprador.value;
	$.continuar.enabled = !$.seleccionarComprador.value;
	$.continuar.opacity = $.continuar.enabled ? 1 : .5;
});

$.listaContactos.addEventListener('itemclick', function(e) {
	var row = $.listaContactos.sections[0].getItemAt(e.itemIndex);
	//list.sections[0].getItemAt(e);
	selectedId = row.nombreContacto.id;
	Ti.API.info(JSON.stringify(selectedId, null, 4));

});
$.listaContactos.selectionIndicator=true;
$.vistaContactos.visible = $.seleccionarComprador.value;

function getClientes() {
	//Ti.API.info('importar frecuentes' + JSON.stringify(Alloy.Globals.compradores,
	// null, 4));

	creaContactos(Alloy.Globals.contactos);

}


function creaContactos(contactos) {
	var listaContactos = [];
	var id = 0;
	Ti.API.info(JSON.stringify(contactos, null, 4));
	contactos.forEach(function(contacto) {
		listaContactos.push({
			nombreContacto : {
				text : contacto.nombreContacto,
				id : contacto.id
			},

		});

	});

	//Ti.API.info(JSON.stringify(frecuentes, null, 4));

	$.listaContactos.sections[0].setItems(listaContactos);

}


$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController("pagoEnLinea");
	inicio = inicio.getView();
	inicio.open();
});

$.continuar.addEventListener('click', function(error) {
	// var referencia = $.seleccionarComprador? '': $.listaContactos.selectedRow

	Ti.API.info(JSON.stringify($.listaContactos.selectedRow, null, 4));

	var inicio = Alloy.createController("generarPagoEnLinea", {
		referencia : selectedId
	});
	inicio = inicio.getView();
	inicio.open();
});

$.listaContactos.addEventListener('itemclick', function(e) {
	$.continuar.enabled = true;
	$.continuar.opacity = 1;
}); 