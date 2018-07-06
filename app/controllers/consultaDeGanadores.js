// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

/*crearListaSorteos(Alloy.Collections.sorteosActivos.where({
 activo : '0'
 }));*/

crearListaSorteos(Alloy.Collections.sorteosActivos);

obtenerSorteoSeleccionado();

$.regresar.addEventListener('click', function(error) {

	var inicio = Alloy.createController("index", args);
	inicio = inicio.getView();
	inicio.open();

});

$.vistaSeleccionarSorteo.addEventListener('scrollend', obtenerSorteoSeleccionado);

function obtenerSorteoSeleccionado() {

	var indice = $.vistaSeleccionarSorteo.currentPage;
	var viewArray = $.vistaSeleccionarSorteo.getViews();
	Ti.API.info(JSON.stringify(viewArray.length, null, 4));
	if(viewArray.length > 0) {
		var idSorteo = viewArray[indice].getViewById('imagen').idImagen;
		llenaDatosGanadores(idSorteo);
		//llenaDatosGanadores('61277');
	}
}


function llenaDatosGanadores(idSorteo) {
	$.vistaPremios.removeAllChildren();
	Ti.API.info('idSorteo: ' + JSON.stringify(idSorteo, null, 4));
	var idColaborador = Alloy.Globals.colaborador.username;
	Ti.API.info('idColaborador: ' + JSON.stringify(idColaborador, null, 4));
	//Alloy.Globals.WsObtenerDescripcionPremios(idColaborador, idSorteo);
	Alloy.Globals.WsObtenerDescripcionPremios('1662196', idSorteo);
	var nombreSorteo = Alloy.Collections.sorteosActivos.where({
		id : idSorteo
	});
	$.etiquetaSorteo.text = nombreSorteo[0].get('nombreSorteo').toString() + ' son:';
	Ti.API.info('nombreSorteo: ' + JSON.stringify(nombreSorteo[0], null, 4));
	setTimeout(function() {
			Ti.API.info('cantidad premios:' + Alloy.Globals.premios.length);
		if (Alloy.Globals.premios.length==0){
			var vistaPremio = Titanium.UI.createView({
				backgroundColor : "white",
				top : 10,
				height : 85,
				left : 10,
				right : 10,
				layout : 'vertical',
				borderRadius : 10
			});

			var etiqueta = Titanium.UI.createLabel({
				"font" : {
					fontSize : '12',
					fontFamily : 'Montserrat-Regular',
					fontStyle : 'regular',
					fontWeight : ''
				},
				text : 'Sin boletos premiados en este sorteo '  ,
				color : '#883fd1',
				left : 10,
				top : 10,
				right : 10

			});
			vistaPremio.add(etiqueta);
			
			$.vistaPremios.add(vistaPremio);
		}
		Alloy.Globals.premios.forEach(function(premio) {
			Ti.API.info('premio:\n' + JSON.stringify(premio, null, 4));

			var vistaPremio = Titanium.UI.createView({
				backgroundColor : "white",
				top : 10,
				height : 85,
				left : 10,
				right : 10,
				layout : 'vertical',
				borderRadius : 10
			});

			var boleto = Titanium.UI.createLabel({
				"font" : { 
					fontSize : '12',
					fontFamily : 'Montserrat-Regular',
					fontStyle : 'regular',
					fontWeight : ''
				},
				text : 'Boleto ganador: ' + premio.numeroBoleto,
				color : '#883fd1',
				left : 10,
				top : 10,
				right : 10

			});

			var nombreGanador = Titanium.UI.createLabel({
				"font" : {
					fontSize : '12',
					fontFamily : 'Montserrat-Regular',
					fontStyle : 'regular',
					fontWeight : ''
				},

				text : 'Nombre: ' + premio.nombreRotulado,
				color : '#2cb9c5',
				left : 10,
				top : 5,
				right : 10
			});
			var premio = Titanium.UI.createLabel({
				"font" : {
					fontSize : '10',
					fontFamily : 'Montserrat-Regular',
					fontStyle : 'regular',
					fontWeight : ''
				},
				text : 'Premio: ' + premio.descripcion,
				color : '#2cb9c5',
				left : 10,

				top : 5,
				right : 10,

			});
			vistaPremio.add(boleto);
			vistaPremio.add(nombreGanador);
			vistaPremio.add(premio);
			$.vistaPremios.add(vistaPremio);
		});
	}, 2000);

}


function crearListaSorteos(sorteos) {
	//var menuActivo = Alloy.Collections.menuPrincipal.where({activo : true});
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	Ti.API.info('crearListaSorteos sorteos:' + JSON.stringify(sorteos, null, 4));
	var paginas = [];
	sorteos.forEach(function(opcion) {
     
		Ti.API.info('fechaFin:' + JSON.stringify(opcion.get('fechaFin'), null, 4));
		Ti.API.info('fechaFiniquito:' + JSON.stringify(opcion.get('fechaFiniquito'), null, 4));

		var fechaFin = new Date(opcion.get('fechaFin'));
		var fechaFiniquito = new Date(opcion.get('fechaFiniquito'));
		var hoy = new Date(Date.now());

		if(fechaFin <= Date.now() && fechaFiniquito > Date.now()) {
			Ti.API.info('SI');

			var imagenSorteo = Titanium.UI.createImageView({
				id : "imagen",
				image : opcion.get('original'),
				top : '10%',
				idImagen : opcion.get('id'),
				width : "250",
				height : '85%',

			});

			var vistaSorteo = Titanium.UI.createView({
				background : "blue"
			});

			// "\uf058",
			var checkBox = Titanium.UI.createLabel({
				text : "\uf058",
				left : '80%',
				top : '17%',
				height : '50',
				width : '50',
				color : "#63dced",
				font : {
					fontSize : 40,
					fontFamily : 'FontAwesome'    
				},
			});
			var fechaSorteo = Titanium.UI.createLabel({
				text : opcion.get('fechaFin'),
				left : '10%',
				right : '10%',
				bottom:'10%',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				color : "white",
				font : {
					fontSize : 20,
					fontFamily : 'Montserrat-Regular'
				},
			});
			var fondoCheckBox = Titanium.UI.createLabel({
				text : "\uf111",
				left : '80%',
				top : '17%',
				height : '50',
				width : '50',
				color : "white",
				font : {
					fontSize : 40,
					fontFamily : 'FontAwesome'
				},
			});
			vistaSorteo.add(imagenSorteo);
			vistaSorteo.add(fondoCheckBox);
			vistaSorteo.add(checkBox);
			vistaSorteo.add(fechaSorteo);

			paginas.push(vistaSorteo);
			//menu.addEventListener('click', clickMenu);
		}
	});
	//Ti.API.info(JSON.stringify(paginas, null, 4));
	$.vistaSeleccionarSorteo.views = paginas;

}