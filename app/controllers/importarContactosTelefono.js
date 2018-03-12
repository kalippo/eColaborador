// Arguments passed into this controller can be accessed via the `$.args` object directly or:
//var args = $.args;

 


if (Ti.Contacts.hasContactsPermissions()) {
	leeContactos();
} else {
	Ti.Contacts.requestContactsPermissions(function(e) {
		if (e.success) {
			leeContactos();

		} else {
			Ti.API.info('no authorization');   
		}
	});
}

function leeContactos() {

	var people = Ti.Contacts.getAllPeople();
	
	creaContactos(people);
}



//return creaContactos(JSON.parse(this.responseText).results);

function creaContactos(contactos) {
	var listaContactos = [];
	 
	contactos.forEach(function(contacto) {
		listaContactos.push({
			nombreContacto : {
				text : contacto.getFullName()
			},
			telefono : {
				text : contacto.getPhone()[1]
			}
		});
	});
	Ti.API.log(JSON.stringify(listaContactos));
	$.listaContactosTelefono.sections[0].setItems(listaContactos);

}
