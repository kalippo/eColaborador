// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
//var args = $.args;

if(Ti.Contacts.hasContactsPermissions()) {
	leeContactos();
} else {
	Ti.Contacts.requestContactsPermissions(function(e) {
		if(e.success) {
			leeContactos();

		} else {
			Ti.API.info('no authorization');
		}
	});
}

function leeContactos() {
	if(Ti.Contacts.hasContactsPermissions()) {
		var contactos = Ti.Contacts.getAllPeople();
	} else {
		Ti.Contacts.requestContactsPermissions(function(e) {
			var contactos = Ti.Contacts.getAllPeople();
		});
	}
	//Ti.API.info('contactos:\n' + JSON.stringify(people,null,4));
	creaContactos(contactos.sort(compare));
}


//return creaContactos(JSON.parse(this.responseText).results);

function creaContactos(contactos) {
	var listaContactos = [];
	var id = 0;
	contactos.forEach(function(contacto) {

		Ti.API.log('contacto:' + JSON.stringify(contacto.getPhone(), null, 4));
		if(contacto.getPhone().mobile) {
			var telefono = contacto.getPhone().mobile[0];
		} else if(contacto.getPhone().home) {
			var telefono = contacto.getPhone().home[0];
		} else if(contacto.getPhone().work) {
			var telefono = contacto.getPhone().work[0];
		} else if(contacto.getPhone().main) {
			var telefono = contacto.getPhone().main[0];
		}

		//telefono = telefono.replace(/[^\d.]/g, "");

		listaContactos.push({
			nombreContacto : {
				text : contacto.getFullName()
			},
			telefono : {
				text : telefono
			},

			seleccionado : {
				itemId : "id" + id++,
				value : false
			}
		});
	});
	Ti.API.log(JSON.stringify(listaContactos));
	$.listaContactos.sections[0].setItems(listaContactos);

}


function handleChange(e) {
	// Get the current "row"
	var item = e.section.getItemAt(e.itemIndex);
	// Update the switch value
	item.seleccionado.value = e.value;
	// Update the section with the new change
	e.section.updateItemAt(e.itemIndex, item);
	Ti.API.info(item);
}


function compare(a, b) {
	// Use toUpperCase() to ignore character casing
	const nombreA = a.fullName.toUpperCase();
	const nombreB = b.fullName.toUpperCase();

	var comparison = 0;
	if(nombreA > nombreB) {
		comparison = 1;
	} else if(nombreA < nombreB) {
		comparison = -1;
	}
	return comparison;
}

