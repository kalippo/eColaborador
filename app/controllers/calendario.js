// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;



$.imagenCalendario.image = Alloy.Globals.imagenCalendario;
$.imagenCalendario.width = Alloy.Globals.anchoPantalla();
$.vistaCalendario.width = $.vistaTitulo.width;
$.regresar.addEventListener('click', function(error) {
	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();
});  