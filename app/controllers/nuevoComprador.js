// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
$.nuevo.color = "black";

$.nuevo.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(0);
});
$.frecuentes.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(1);
});
$.telefono.addEventListener('click', function(e) {
	$.vistaFiltros.scrollToView(2);
});

$.vistaFiltros.addEventListener('scroll', function(e) {

	$.nuevo.color = "#6dace7";
	$.frecuentes.color = "#6dace7";
	$.telefono.color = "#6dace7";

	if (e.currentPage == 0) {
		$.nuevo.color = "black";
	} else if (e.currentPage == 1) {
		$.frecuentes.color = "black";
	} else if (e.currentPage == 2) {
		$.telefono.color = "black";
	}

});


$.regresar.addEventListener('click', function(error) {
	var validacion = Alloy.createController("misClientes");
	validacion = validacion.getView();
	validacion.open();
}); 