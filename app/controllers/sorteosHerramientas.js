// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;




$.atras.addEventListener('click', function(error) {   

	var inicio = Alloy.createController("index");
	inicio = inicio.getView();
	inicio.open();

});


