// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.listaCOntactos.addEventListener('itemclick', function(error) {

	var validacion = Alloy.createController("detalleCliente");
	validacion = validacion.getView();
	validacion.open();

});

$.regresar.addEventListener('click', function(error) {

	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();

});

// https://randomuser.me/api/?results=10

function getClientes() {
	//https://randomuser.me/api/?results=10

	var url = "https://randomuser.me/api/?results=10";
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			//Ti.API.info("Received text: " + this.responseText);
			creaContactos(JSON.parse(this.responseText).results);
			
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error);
			
		},
		timeout : 5000 // in milliseconds
	});
	// Prepare the connection.
	client.open("GET", url);
	// Send the request.
	client.send();

}

function creaContactos(contactos){
	var items = [];
	contactos.forEach(function(contacto){
		
		items.push({
			icon:{image: contacto.picture.thumbnail},
			nombreContacto:{text:contacto.name.first }
		});
	});
	
	Ti.API.info(items);
	$.listaCOntactos.sections[0].setItems(items);
}


getClientes();
