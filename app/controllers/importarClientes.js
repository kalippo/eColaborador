// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


getClientes();
  
function getClientes() {
	
	return creaContactos(Alloy.Globals.compradores);
		
}



function creaContactos(contactos) {
	var todos = [];
	
	contactos.forEach(function(contacto) {
		
			todos.push({
				nombreContacto : {
					text : contacto.Nombre
				},
				telefono : {
					text : contacto.Telefono
				}
			});
		});
		 
	$.listaFrecuentes.sections[0].setItems(todos);
	
}