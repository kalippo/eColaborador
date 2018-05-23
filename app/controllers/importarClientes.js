// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


getClientes();
  
function getClientes() {
	Ti.API.info('importar frecuentes'+JSON.stringify(Alloy.Globals.compradores,null,4));

	 creaContactos(Alloy.Globals.compradores);
		
}



function creaContactos(contactos) {
	var frecuentes = [];
	var id = 0;
	contactos.forEach(function(contacto) {
		frecuentes.push({
				nombreContacto : {
					text : contacto.nombre
				},
				telefono : {
					text : contacto.telefono
				},
				seleccionado:{
					itemId:"id"+ id++,
					value:false
				}
			});
			
			
		});
		 
		 
		 Ti.API.info(JSON.stringify(frecuentes,null,4));

	$.listaContactos.sections[0].setItems(frecuentes);
	
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