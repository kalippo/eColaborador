// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

getClientes();

function getClientes() {
	//Ti.API.info('importar frecuentes' + JSON.stringify(Alloy.Globals.compradores,
	// null, 4));

	creaContactos(Alloy.Globals.compradores);

}


function creaContactos(contactos) {
	var frecuentes = [];  
	var id = 0;
	contactos.forEach(function(contacto) {
		var repetido = Alloy.Globals.contactos.filter(function(c) {
			return c.telefono === contacto.telefono;
		});
		Ti.API.info('repetido:' + contacto.telefono + '-' + JSON.stringify(repetido[0], null, 4));

		if(repetido[0]) {
			var activo = true;
		} else {
			var activo = false;
		}

		frecuentes.push({
			nombreContacto : {
				text : contacto.nombre
			},
			telefono : {
				text : contacto.telefono
			},
			seleccionado : {
				itemId : "id" + id++,
				value : activo,
				enabled: !activo
			}
		});

	});

	//Ti.API.info(JSON.stringify(frecuentes, null, 4));

	$.listaContactos.sections[0].setItems(frecuentes);

}


function handleChange(e) {
	// Get the current "row"
	var item = e.section.getItemAt(e.itemIndex);
	// Update the switch value
	item.seleccionado.value = e.value;
	// Update the section with the new change
	e.section.updateItemAt(e.itemIndex, item);
	//Ti.API.info(item);
}
