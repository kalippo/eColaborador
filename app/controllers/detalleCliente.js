// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;
var cantidadBoletos = 0;
Ti.API.info(JSON.stringify(args, null, 4));
var detalle = "";

Alloy.Globals.contactos.forEach(function(contacto) {
	if(contacto.id == args) {
		detalle = contacto;
	}
});

Ti.API.info(JSON.stringify(detalle, null, 4));

$.nombreCliente.text = detalle.nombreContacto;
$.telefonoCliente.text = detalle.telefono;
$.pagoPendiente.text = detalle.pagoPendiente;
$.notas.value = detalle.notas;
if(detalle.pagoPendiente > 0) {
	$.estatus.text = "Adeudo";
	//$.vistaEstatus.backgroundColor='red';
}

asignarBoletos();

$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController("misClientes");
	inicio = inicio.getView();
	inicio.open();
});

$.agregarPago.addEventListener('click', function(error) {
	var dialog = Ti.UI.createAlertDialog({
		message : 'Cantidad a abonar:',
		style : Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT,
		ok : 'Abonar',
		title : 'Agregar Abono'
	});
	dialog.addEventListener('click', function(e) {

		Ti.API.info(JSON.stringify(detalle.pagoPendiente, null, 4));

		var newContactos = Alloy.Globals.contactos.filter(function(e) {
			return e !== detalle;
		});
		detalle.pagoPendiente -= e.text;
		newContactos.push(detalle);
		Alloy.Globals.contactos = newContactos;
		Ti.App.Properties.setList('listaContactos', Alloy.Globals.contactos);

		$.pagoPendiente.text = detalle.pagoPendiente;

	});
	dialog.show();
});

$.seleccionarBoletos.addEventListener('click', function(error) {
	var inicio = Alloy.createController("seleccionBoletos", args);
	inicio = inicio.getView();
	inicio.open();
});
function asignarBoletos() {
	//boletos.forEach(function(sorteo){
	detalle.boletos.forEach(function(boleto) {
		Ti.API.info(JSON.stringify(boleto, null, 4));
		crearAsignacion(boleto.id, boleto.cantidad);
		cantidadBoletos += boleto.cantidad;

	});
	$.cantidadBoletos.text = cantidadBoletos;
	//});
}


function crearAsignacion(sorteo, cantidadBoletos) {
	var vistaAsignacion = Titanium.UI.createView({
		backgroudn : "white",
		width : '115',
		height : '30',
		top : 1,
		left : 1,
		layout : 'horizontal'
	});
	var cantidadBoletos = Ti.UI.createLabel({
		color : 'white',
		backgroundColor : 'blue',
		left : '5',
		width : '24',
		top : '1',
		height : '24',
		borderRadius : '3',
		font : {
			fontSize : 15,
			fontFamily : 'Montserrat-Regular'
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		text : cantidadBoletos
	});

	var imagenSorteo = Ti.UI.createImageView({
		image : Alloy.Collections.sorteosActivos.get(sorteo.toString()).get('original'),
		width : '80',
		height : '26',
		left : '1'
	});
	vistaAsignacion.add(cantidadBoletos);
	vistaAsignacion.add(imagenSorteo);
	//Ti.API.info(JSON.stringify(vistaAsignacion, null, 4));
	//Ti.API.info(JSON.stringify(cantidadBoletos, null, 4));
	//Ti.API.info(JSON.stringify(imagenSorteo, null, 4));
	$.vistaBoletosAsignados.add(vistaAsignacion);

}


/********************************************************

 * Appcelerator Designer Generated Code
 *******************************************************/

/**
 * edicionNotas
 * @param {object} e - event object
 */
function edicionNotas(e) {

	var newContactos = Alloy.Globals.contactos.filter(function(e) {
		return e !== detalle;
	});
	detalle.notas = $.notas.value;
	newContactos.push(detalle);
	Alloy.Globals.contactos = newContactos;
	Ti.App.Properties.setList('listaContactos', Alloy.Globals.contactos);
	actualizaContactos( );
	Ti.API.info(JSON.stringify(Alloy.Globals.contactos, null, 4));
}


function actualizaContacto(contactoViejo, contactoNuevo) {
	var newContactos = Alloy.Globals.contactos.filter(function(e) {
		return e !== contactoViejo;
	});

	newContactos.push(contactoNuevo);
	Alloy.Globals.contactos = newContactos;
	Ti.App.Properties.setList('listaContactos', Alloy.Globals.contactos);
	actualizaContactos( );
	//Ti.API.info(JSON.stringify(Alloy.Globals.contactos, null, 4));
}


function actualizaContactos() {

	Alloy.Globals.Cloud.Users.update({
		
		custom_fields : {
			compradores : JSON.stringify(Alloy.Globals.contactos)
			 
		}
	}, function(e) {
		if(e.success) {
			var user = e.users[0];
			Ti.API.info('Success:\n' + JSON.stringify(contactos));
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

