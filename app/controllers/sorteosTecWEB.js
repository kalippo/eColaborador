// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

if(Alloy.Globals.isiPhoneX()==true) {
	$.vistaTitulo.top = Alloy.Globals.margenNotch;
} else {

	$.vistaTitulo.top = "0"; 
}

$.regresar.addEventListener('click',function(){
	var validacion = Alloy.createController("index");
				validacion = validacion.getView();
				validacion.open();
});


if (Ti.Platform.osname =='android')
{
	$.WebView_1.url = 'https://docs.google.com/gview?embedded=true&url=https://s3-us-west-1.amazonaws.com/storage-platform.cloud.appcelerator.com/VsCFrroIecox2cc1mCb7lsuTtmQFX4zn/files/60/36/5ba41b644b56530222f66844/sorteoTradicional.pdf';
}else {
	$.WebView_1.url = 'https://s3-us-west-1.amazonaws.com/storage-platform.cloud.appcelerator.com/VsCFrroIecox2cc1mCb7lsuTtmQFX4zn/files/60/36/5ba41b644b56530222f66844/sorteoTradicional.pdf';
	
}
