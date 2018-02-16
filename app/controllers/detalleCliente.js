// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args=$.args;
asignarBoletos();
$.regresar.addEventListener('click', function(error) {
	var inicio=Alloy.createController("misClientes");
	inicio=inicio.getView();
	inicio.open();
});
$.seleccionarBoletos.addEventListener('click', function(error) {
	var inicio=Alloy.createController("seleccionBoletos");
	inicio=inicio.getView();
	inicio.open();
});
function asignarBoletos() {
	//boletos.forEach(function(sorteo){
	crearAsignacion('1',1);
	//});
}
function crearAsignacion(cantidadBoletos,sorteo) {
	var vistaAsignacion=Titanium.UI.createView({
		backgroudn:"white",
		width:'100',
		height:'30',
		top:10,
		left:10,
		layout:'horizontal'
	});
	var cantidadBoletos=Ti.UI.createLabel({
		color:'white',
		backgroundColor:'blue',
		left:'5',
		width:'24',
		top:'1',
		height:'24',
		borderRadius: '3',
font: { fontSize:15, fontFamily: 'Montserrat-Regular' },
textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		text:cantidadBoletos
	});
	var imagenSorteo=Ti.UI.createImageView({
		image:'https://s3-us-west-1.amazonaws.com/storage-platform.cloud.appcelerator.com/VsCFrroIecox2cc1mCb7lsuTtmQFX4zn/photos/4d/a9/5a70aaa66e5b2d3de2ee30e2/sms-btn_thumb_100.png',
		width:'65',
		height:'28',
		left:'5'
	});
	vistaAsignacion.add(cantidadBoletos);
	vistaAsignacion.add(imagenSorteo);
	Ti.API.info(JSON.stringify(vistaAsignacion,null,4));
	Ti.API.info(JSON.stringify(cantidadBoletos,null,4));
	Ti.API.info(JSON.stringify(imagenSorteo,null,4));
	$.vistaBoletosAsignados.add(vistaAsignacion);
}
