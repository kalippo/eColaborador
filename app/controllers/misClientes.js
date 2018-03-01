// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
getClientes();

$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();
}); 

$.todos.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(0);
});
$.conAdeudo.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(1);
});
$.sinAdeudo.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(2);
});

$.vistaFiltros.addEventListener('scroll', function(e) {

	$.todos.color = "#6dace7";
	$.conAdeudo.color = "#6dace7";
	$.sinAdeudo.color = "#6dace7";

	if (e.currentPage == 0) {
		$.todos.color = "black";
	} else if (e.currentPage == 1) {
		$.conAdeudo.color = "black";
	} else if (e.currentPage == 2) {
		$.sinAdeudo.color = "black";
	}

});

function getClientes() {
	var url = "https://randomuser.me/api/?results=15";
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			return creaContactos(JSON.parse(this.responseText).results);
		},
		onerror : function(e) {
			Ti.API.info(e.error);
		},
		timeout : 5000 // in milliseconds
	});
	client.open("GET", url);
	client.send();
}

function creaContactos(contactos) {
	var todos = [];
	var conAdeudo = [];
	var sinAdeudo = [];
	
	
	contactos.forEach(function(contacto) {
		var color = "green";
		if (contacto.gender == "male") {
			color = "red";
			conAdeudo.push({
				nombreContacto : {
					text : contacto.name.first
				},
				estatus : {
					color : color
				}
			});
		}else{
			sinAdeudo.push({
				nombreContacto : {
					text : contacto.name.first
				},
				estatus : {
					color : color
				}
			});
		}
		todos.push({
				nombreContacto : {
					text : contacto.name.first
				},
				estatus : {
					color : color
				}
			});
	});
	$.listaCOntactos.sections[0].setItems(todos);
	$.listaConAdeudo.sections[0].setItems(conAdeudo);
	$.listaSinAdeudo.sections[0].setItems(sinAdeudo);
	 
}

$.listaCOntactos.addEventListener('itemclick', function(error) {
	var validacion = Alloy.createController("detalleCliente");
	validacion = validacion.getView();
	validacion.open();
});

$.crearNuevoComprador.addEventListener('click', function(error) {
	var validacion = Alloy.createController("nuevoComprador");
	validacion = validacion.getView();
	validacion.open();
});
