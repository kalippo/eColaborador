// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

getClientes();


$.listaCOntactos.addEventListener('itemclick', function(error) {
	var validacion = Alloy.createController("detalleCliente");
	validacion = validacion.getView();
	validacion.open();
});




function getClientes() {
/*
	var url = "https://randomuser.me/api/?results=10";
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			creaContactos(JSON.parse(this.responseText).results);
		},
		onerror : function(e) {
			Ti.API.info(e.error);
		},
		timeout : 5000 // in milliseconds
	});
	client.open("GET", url);
	client.send();
	*/
}

function creaContactos(contactos) {
	var items = [];
	contactos.forEach(function(contacto) {

		items.push({
			icon : {
				image : contacto.picture.thumbnail
			},
			nombreContacto : {
				text : contacto.name.first
			}
		});
	});
	$.listaCOntactos.sections[0].setItems(items);
}


