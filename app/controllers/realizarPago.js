// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

var win = Titanium.UI.currentWindow; 

$.win.addEventListener('android:back', function(e) {
    e.cancelBubble = true;

    // Ti.App.fireEvent('android_back_button');
});
   
Alloy.Globals.contactos.forEach(function(contacto) {
	if(contacto.id == args) {
		detalle = contacto;
	}
});

Ti.API.info('detalle viejo:' + JSON.stringify(detalle, null, 4));

$.pagar.addEventListener('click', function(error) {

	var pago = parseInt($.cantidadPagar.value);
	Ti.API.info('pago:'+pago);
	if(pago>-100000) {
		try {
			var newContactos = Alloy.Globals.contactos.filter(function(e) {
				return e !== detalle;
			});
			Ti.API.info(JSON.stringify(detalle.pagoPendiente, null, 4));
			if(detalle.pagoPendiente == null || detalle.pagoPendiente == NaN) {
				detalle.pagoPendiente = 0 - parseInt($.cantidadPagar.value);
			} else {
				detalle.pagoPendiente = detalle.pagoPendiente - parseInt($.cantidadPagar.value);
			}
			var hoy = new Date(Date.now());
			detalle.abonos.push({
				cantidad : $.cantidadPagar.value,
				fecha : hoy.toLocaleDateString()
			});
			Ti.API.info('detalle actualizado:' + JSON.stringify(detalle, null, 4));
			newContactos.push(detalle);
			Alloy.Globals.contactos = newContactos;
			Alloy.Globals.guardarContactos();
			//Ti.API.info('contactos:' + JSON.stringify(Alloy.Globals.contactos, null, 4));

		} catch (err) {
			alert('Ha ocurrido un error al realizar el pago');
		} 
	} else {
		alert('cantidad no valida, use solo numeros');
	}
	var inicio = Alloy.createController("detalleCliente", args);
	inicio = inicio.getView();
	inicio.open();

});

$.regresar.addEventListener('click', function(err) {

	var inicio = Alloy.createController("detalleCliente", args);
	inicio = inicio.getView();
	inicio.open();
});

