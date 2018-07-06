// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
//getClientes();
   
desplegarCompradores();

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

	if(e.currentPage == 0) {
		$.todos.color = "black";
	} else if(e.currentPage == 1) {
		$.conAdeudo.color = "black";
	} else if(e.currentPage == 2) {
		$.sinAdeudo.color = "black";
	}

});

function desplegarCompradores() {
	var todos = [];
	var conAdeudo = [];
	var sinBoleto = [];
	//Ti.API.info(JSON.stringify(Alloy.Globals.compradores.Clientes.Nombres,null,4));
	if(Alloy.Globals.contactos != null) {
		$.sinClientes.visible = false;
		Alloy.Globals.contactos.sort().forEach(function(contacto) {
			//Ti.API.info(JSON.stringify(contacto));
			//Ti.API.info(JSON.stringify(contacto.boletos.length));

			todos.push({
				nombreContacto : {
					text : contacto.nombreContacto,
					contactoId : contacto.id
				}
			});
			if(contacto.pagoPendiente > 0) {
				conAdeudo.push({
					nombreContacto : {
						text : contacto.nombreContacto,
						contactoId : contacto.id
					}

				});
			}
			if(contacto.boletos.length == 0) {
				sinBoleto.push({
					nombreContacto : {
						text : contacto.nombreContacto,
						contactoId : contacto.id
					}
				});
			}
			 
			
		});
		$.listaCOntactos.sections[0].setItems(todos);
		$.listaConAdeudo.sections[0].setItems(conAdeudo);
		$.listaSinBoletos.sections[0].setItems(sinBoleto);
		//desplegarCompradoresSinBoletos(sinBoleto);
		//Ti.API.info(JSON.stringify(sinBoleto, null, 4));

	} else {
		$.sinClientes.visible = true;
	}
}


function desplegarCompradoresSinBoletos(sinBoleto) {
	/*	var secciones = [];
	 var listView = Ti.UI.createListView();
	 var sorteoSeccion = Ti.UI.createListSection({ headerTitle: 'Sin Boletos'});
	 //Ti.API.info(JSON.stringify(sorteo, null, 4));
	 var sorteoDataSet = [
	 {properties: { title: 'algo'}},
	 {properties: { title: 'algo mas'}}
	 ];
	 //Ti.API.info(JSON.stringify(sorteoDataSet, null, 4));
	 sorteoSeccion.setItems(sorteoDataSet);
	 secciones.push(sorteoSeccion);

	 Alloy.Collections.sorteosActivos.forEach(function (sorteo){
	 var sorteoSeccion = Ti.UI.createListSection({ headerTitle:
	 sorteo.get('nombreSorteo')});
	 //Ti.API.info(JSON.stringify(sorteo, null, 4));
	 var sorteoDataSet = [
	 {properties: { title: 'algo'}},
	 {properties: { title: 'algo mas'}}
	 ];
	 //Ti.API.info(JSON.stringify(sorteoDataSet, null, 4));
	 sorteoSeccion.setItems(sorteoDataSet);
	 secciones.push(sorteoSeccion);
	 //$.listaSinAdeudo.secctions = secciones;
	 //Ti.API.info(JSON.stringify(secciones, null, 4));

	 });
	 listView.sections = secciones;
	 $.vistaSinAdeudo.add(listView);
	 */

	var layout = [{
		title : "Sin Boleto",
		isparent : true,
		opened : false,
		sub : []
	}];

	sinBoleto.forEach(function(contacto) {
		layout[0].sub.push({
			title : contacto.nombreContacto.text
		});
	});
	//Ti.API.info('SORTEOS');
	Alloy.Collections.sorteosActivos.forEach(function(sorteo) {
		//Ti.API.info(JSON.stringify(sorteo, null, 4));
		var contactoSinBoleto = {
			title : sorteo.get('nombreSorteo'),
			isparent : true,
			opened : false,
			sub : []
		};
		Alloy.Globals.contactos.sort().forEach(function(contacto) {
			//Ti.API.info(JSON.stringify(contacto, null, 4));
			contacto.boletos.forEach(function(boleto) {
				if(boleto.id == sorteo.get('id')) {
					contactoSinBoleto.sub.push({
						title : contacto.nombreContacto.text
					});
				}
			});
		});

	});
	//
	var tableView = Ti.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		top : 0,
		height : Ti.Platform.displayCaps.platformHeight,
		data : layout

	});

	tableView.addEventListener("click", function(e) {
		//Is this a parent cell? if (e.row.isparent) {
		if(e.row.isparent) {
			//Is it opened?
			if(e.row.opened) {
				for(var i = e.row.sub.length; i > 0; i = i - 1) {
					tableView.deleteRow(e.index + i);
				}
				e.row.opened = false;
			} else {
				//Add teh children.
				var currentIndex = e.index;
				for(var i = 0; i < e.row.sub.length; i++) {
					tableView.insertRowAfter(currentIndex, e.row.sub[i]);
					currentIndex++;
				}
				e.row.opened = true;
			}
		}

	});

	$.vistaSinAdeudo.add(tableView);

}





function creaContactos(contactos) {
	var todos = [];
	var conAdeudo = [];
	var sinAdeudo = [];

	contactos.forEach(function(contacto) {
		var color = "green";
		if(contacto.gender == "male") {
			color = "red";
			conAdeudo.push({
				nombreContacto : {
					text : contacto.name.first

				},
				estatus : {
					color : color
				}
			});
		} else {
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


$.listaCOntactos.addEventListener('itemclick', function(e) {
	var row = $.listaCOntactos.sections[0].getItemAt(e.itemIndex);
	//Ti.API.info(JSON.stringify(row.nombreContacto.contactoId, null, 4));
	//list.sections[0].getItemAt(e);
	var validacion = Alloy.createController("detalleCliente", row.nombreContacto.contactoId);
	validacion = validacion.getView();
	validacion.open();
});
$.listaConAdeudo.addEventListener('itemclick', function(e) {
	var row = $.listaConAdeudo.sections[0].getItemAt(e.itemIndex);
	//Ti.API.info(JSON.stringify(row.nombreContacto.contactoId, null, 4));
	//list.sections[0].getItemAt(e);
	var validacion = Alloy.createController("detalleCliente", row.nombreContacto.contactoId);
	validacion = validacion.getView();
	validacion.open();
});
$.listaSinBoletos.addEventListener('itemclick', function(e) {
	var row = $.listaSinBoletos.sections[0].getItemAt(e.itemIndex);
	//Ti.API.info(JSON.stringify(row.nombreContacto.contactoId, null, 4));
	//list.sections[0].getItemAt(e);
	var validacion = Alloy.createController("detalleCliente", row.nombreContacto.contactoId);
	validacion = validacion.getView();
	validacion.open();
});

$.crearNuevoComprador.addEventListener('click', function(error) {
	var validacion = Alloy.createController("nuevoComprador");
	validacion = validacion.getView();
	validacion.open();
});


