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
	 var id=0;
	contactos.forEach(function(contacto) {
		listaContactos.push({
			nombreContacto : {
				text : contacto.getFullName()
			},
			telefono : {
				text : contacto.getPhone()[1]
			},
			
				seleccionado:{
					itemId:"id"+ id++,
					value:false
				}
		});
	});
	Ti.API.log(JSON.stringify(listaContactos));
	$.listaContactos.sections[0].setItems(listaContactos);

}


function handleChange(e){
    // Get the current "row"
    var item = e.section.getItemAt(e.itemIndex);
    // Update the switch value
    item.seleccionado.value = e.value;
    // Update the section with the new change
    e.section.updateItemAt(e.itemIndex, item);
    Ti.API.info(item);
}
