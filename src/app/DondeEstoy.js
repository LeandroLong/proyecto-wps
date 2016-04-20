/**
 * @require plugins/Tool.js
 * @require GeoExt/widgets/Action.js
 * @require OpenLayers/Control/DrawFeature.js
 * @require OpenLayers/Control/DragFeature.js
 * @require OpenLayers/Handler/Polygon.js
 * @require OpenLayers/Handler/Path.js
 * @require OpenLayers/Geometry.js
 * @require OpenLayers/Format/WKT.js
 * @require OpenLayers/Control/GetFeature.js
 * @require OpenLayers/Control/SelectFeature.js
 * @require OpenLayers/Proj4js.js
 * @require AreaInfluenciaDondeEstoy.js
 * @require MostrarMenuStep.js
 * @require MostrarMenuLugares.js
 */

 
var DondeEstoy = Ext.extend(gxp.plugins.Tool, {

    ptype: 'app_dondeestoy',
    
    /** Inicio del plugin */
    init: function(target) {
		DondeEstoy.superclass.init.apply(this, arguments);
			
		
					
			var options = {
			enableHighAccuracy: false,
			timeout: 1200,
			maximumAge: 0
			};

			function success(pos) {
			cord = pos.coords;
			
				};

			function error(err) {
			
			
			return;
				};

			navigator.geolocation.getCurrentPosition(success, error, options);
			
       			
		    this.map = target.mapPanel.map;
	
							  
        // Añade botones de acción cuando el VISOR GPX(wiever) está listo
        target.on('ready', function() {
			
			
            // Obtiene una referencia a la capa de vector de app.js
            this.layer = target.getLayerRecordFromMap({
                name: 'sketch',
                source: 'ol'
            }).getLayer();
			
			//Inicializa las variables que usara GMaps para calculo de ruta
			this.directionsDisplay = new google.maps.DirectionsRenderer;
			this.mapaMio = this.map.layers[1].mapObject;	
			this.directionsDisplay.setMap(this.mapaMio);	
			this.directionsService = new google.maps.DirectionsService;
			
			
			
            // Algunos valores predeterminados
            var actionDefaults = {
                map: target.mapPanel.map,
                enableToggle: true,
                toggleGroup: this.ptype,
                allowDepress: true
            };
			// Inicio de agregacion de ACCIONES
            this.addActions([
			
			        new GeoExt.Action(Ext.apply({
					id:'donde',
                    text: '  Donde Estoy',
					iconCls: 'icon-go',
					handler: this.muestraMenu.createDelegate(this),
                    control: new OpenLayers.Control()
                }, actionDefaults))
            ]); // Fin de agregación de ACCIONES
			
			 this.addActions([
			
			        new GeoExt.Action(Ext.apply({
					id: 'punto',
                    text: '  Punto en la Ciudad',
					iconCls: 'icon-selec',
					handler: this.muestraMenu.createDelegate(this),
                    control: new OpenLayers.Control.DrawFeature(
                        this.layer,OpenLayers.Handler.Point, {
                        eventListeners: {
                            featureadded: this.buffer2,
                            scope: this
                        }
                    })
                }, actionDefaults))
            ]); // Fin de agregación de ACCIONES
			
					
			var comboDE = new Ext.form.ComboBox({
						id: 'combo',
						emptyText:'Area..',
						typeAhead: true,
						editable: false,
						store: ['200 mts', '350 mts', '500 mts', '1000 mts', '1500 mts', '2000 mts','3000 mts','5000 mts','6000 mts'],
						triggerAction: 'all',
						mode: 'local',
						width: 80,
						forceSelection: true,
						hidden: true,
					    selectOnFocus: true,
						listeners: {
							select: function(comboDE, selection) {
								
								if(typeof cord === 'undefined'){
									cord = null;
								}
							this.buffer(this,cord,selection.data.field1);
									},
							scope: this
						}
					});
			
			this.addOutput(comboDE);		
        }, this);
    },
	
	// Proceso que ejecuta un BUFFER
    buffer2: function(evt) {
		
				//Borra los poligonos dibujados
		for(var z=0;this.layer.features.length-1>z;z++){
			this.layer.removeFeatures(this.layer.features[z]);
				}
		
		if(this.output[0].lastSelectionText){
			
		
		
		//Si entra con boton lugar ver si se selecciono un area de influecia
		var puntoOrigen = new Proj4js.Point(evt.feature.geometry.x,evt.feature.geometry.y);
		
		// Definen en Proj4js los sistemas de coordenadas
		Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
		var fuente = new Proj4js.Proj('EPSG:900913');
		Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
		var destinoUnico = new Proj4js.Proj('EPSG:4326');
		
		Proj4js.transform(fuente, destinoUnico, puntoOrigen);
	//	var posicion.latitude = puntoOrigen.x;
	//	var posicion.longitude = puntoOrigen.y;
	
		var posicion = {latitude: puntoOrigen.y, longitude: puntoOrigen.x};
		var area = new AreaInfluenciaDondeEstoy();
		area.buffer(this,posicion,this.output[0].lastSelectionText);}
					
		},
	
	// Proceso que ejecuta un BUFFER
    buffer: function(todo,cord,selection) {
		
		
		var punto=Ext.getCmp('punto');
		
		if(punto.pressed && selection!=null){
			
			 Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
			 Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
			 var  destino= new Proj4js.Proj('EPSG:4326');
			 var origen = new Proj4js.Proj('EPSG:900913');
		     
		try {
  
			 
			 var puntoBuffer = new Proj4js.Point(todo.map.layers[2].features[0].geometry.x,todo.map.layers[2].features[0].geometry.y);
			 
			 Proj4js.transform(origen, destino, puntoBuffer);
			 
			 var coordenada = {latitude: puntoBuffer.y, longitude: puntoBuffer.x};
			 
			 var area = new AreaInfluenciaDondeEstoy();
			 
		     area.buffer(todo,coordenada,selection);
			 
			   adddlert("Welcome guest!");
		}
		catch(e){
			return;
		}
		
			
		}
		else{
			
			//Si entra con boton lugar ver si se selecciono un area de influecia
		
		var area = new AreaInfluenciaDondeEstoy();
		
		area.buffer(todo,cord,selection);
		}
		
		
					
		},
	
	
	muestraMenu: function(objeto){
		
		//Borra los poligonos dibujados
		for(var z=this.layer.features.length-1; z>=0; --z){
			this.layer.removeFeatures(this.layer.features[z]);
		}
		
		var arbol = Ext.getCmp('arbolCapas');
		var lugar=Ext.getCmp('lugaresCercanos');
		var step=Ext.getCmp('paneloeste');
		var punto=Ext.getCmp('punto');
		var donde=Ext.getCmp('donde');
		var combo=Ext.getCmp('combo');
		var rutas= this.directionsDisplay;
		
		
		if(donde.pressed){ 
			punto.toggle(false);
			if(typeof cord === 'undefined' || cord==null){
			
			window.setTimeout(function () {
				 
				 
			var options = {
			enableHighAccuracy: false,
			timeout: 1000,
			maximumAge: 0
							};

			function success(pos) {
			cord = pos.coords;			
			Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
			 Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
			 var origen = new Proj4js.Proj('EPSG:4326');
			 var destino = new Proj4js.Proj('EPSG:900913');
		     
			 var puntoBuffer = new Proj4js.Point(cord.longitude,cord.latitude);
			
			 combo.setValue(null);
		
			 Proj4js.transform(origen, destino, puntoBuffer);
		
				//Crea un punto donde va a centrar el mapa una vez que dibuje la ruta
			var pixel = new OpenLayers.LonLat(puntoBuffer.x,puntoBuffer.y);
				//Centra el mapa al punto especificado
			this.app.mapPanel.map.moveTo(pixel,15,true);		
			punto.toggle(false);		
				var miPunto="POINT("+puntoBuffer.x+" "+""+puntoBuffer.y+")";
				var wkt = OpenLayers.Geometry.fromWKT(miPunto);
				var mypolygon = new OpenLayers.Feature.Vector(wkt);
				this.app.portalItems[0].layers.map.layers[2].addFeatures([mypolygon]);
				
					 
		lugar.show();
		
		arbol.ownerCt.doLayout();
		
		combo.setVisible(true);
				};

			function error(err) {
			
			Ext.Msg.show({
			title:'ERROR',
			msg: 'No se ha podido calcular su ubicación, intente nuevamente!',
			buttons: Ext.Msg.OK,
			animEl: 'elId',
			icon: Ext.MessageBox.ERROR 
			});
			donde.toggle(false);
			combo.setVisible(false);
			combo.setValue(null);
			lugar.hide();
			arbol.ownerCt.doLayout();
			rutas.setDirections({routes: []});
			return;
				};

			navigator.geolocation.getCurrentPosition(success, error, options);
						 
						 
						 },'1001');
						 
			 }
			 else{
				 this.directionsDisplay.setDirections({routes: []});
				 if(lugar.body.dom.childElementCount!=0){
			this.mostrarMenuLugares.removeOutput();
			}
			if(step.body.dom.childNodes[0].childElementCount!=0){
			this.mostrarMenuStep.removeOutput();
			}
			
	
			 Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
			 Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
			 var origen = new Proj4js.Proj('EPSG:4326');
			 var destino = new Proj4js.Proj('EPSG:900913');
		     
			 var puntoBuffer = new Proj4js.Point(cord.longitude,cord.latitude);
			
			 combo.setValue(null);
		
			 Proj4js.transform(origen, destino, puntoBuffer);
		
				//Crea un punto donde va a centrar el mapa una vez que dibuje la ruta
			var pixel = new OpenLayers.LonLat(puntoBuffer.x,puntoBuffer.y);
				//Centra el mapa al punto especificado
			this.map.moveTo(pixel,15,true);		
			punto.toggle(false);		
				var miPunto="POINT("+puntoBuffer.x+" "+""+puntoBuffer.y+")";
				var wkt = OpenLayers.Geometry.fromWKT(miPunto);
				var mypolygon = new OpenLayers.Feature.Vector(wkt);
				this.layer.addFeatures([mypolygon]);
				
					 
		lugar.show();
		
		arbol.ownerCt.doLayout();
		
		combo.setVisible(true);
			 }
		}
					
		else if(punto.pressed){
			 this.directionsDisplay.setDirections({routes: []});
			 combo.setValue(null);
			 combo.setVisible(true);
			 if(lugar.body.dom.childElementCount!=0){
				this.mostrarMenuLugares.removeOutput();
				}
				if(step.body.dom.childNodes[0].childElementCount!=0){
			this.mostrarMenuStep.removeOutput();
			}
				
				lugar.show();
		
		arbol.ownerCt.doLayout();
		
	
					
		}
		else {				
			lugar.hide();
			punto.show();
			step.collapse();
			arbol.ownerCt.doLayout();
			this.output[0].setVisible(false);
			this.output[0].setValue(null);
			this.directionsDisplay.setDirections({routes: []});
			if(lugar.body.dom.childElementCount!=0){
			this.mostrarMenuLugares.removeOutput();
			}
			if(step.body.dom.childNodes[0].childElementCount!=0){
			this.mostrarMenuStep.removeOutput();
			}
			
		}
		
		
	}

});

Ext.preg(DondeEstoy.prototype.ptype, DondeEstoy);