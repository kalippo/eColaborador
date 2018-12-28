// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

if(Alloy.Globals.isiPhoneX()==true) {
	$.vistaTitulo.top = Alloy.Globals.margenNotch;
} else {

	$.vistaTitulo.top = "0"; 
}

$.atras.addEventListener('click', function(error) {
	var validacion = Alloy.createController("index");
	validacion = validacion.getView();
	validacion.open();
});

/*
$.webAviso.addEventListener('error', function(e) {
 
	var code = e.errorCode;
	if (code == Ti.UI.URL_ERROR_SSL_FAILED) {
		 $.webAviso.stopLoading( );
	}
});

$.webAviso.addEventListener("sslerror", function(e) {
    Ti.API.error("Event: sslerror");
    Ti.API.error(JSON.stringify(e));
});

*/