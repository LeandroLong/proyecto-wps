/**
 * Add all your dependencies here.
 *
 * @require widgets/Viewer.js
 * @require plugins/LayerTree.js
 * @require plugins/OLSource.js
 * @require plugins/OSMSource.js
 * @require plugins/WMSCSource.js
 * @require plugins/ZoomToExtent.js
 * @require plugins/Zoom.js
 * @require OpenLayers/Layer/Vector.js
 * @require OpenLayers/Renderer/Canvas.js
 * @require GeoExt/widgets/ZoomSlider.js
 * @require plugins/GoogleSource.js
 * @require plugins/WMSGetFeatureInfo.js
 * @require MostrarMenu.js
 * @require DondeEstoy.js
 * @require MiArbol.js
 * @require PuntoSeleccionado.js
 */


 
    var app = new gxp.Viewer({
    portalConfig: {
        layout: "border",
        region: "center",
        
        // by configuring items here, we don't need to configure portalItems
        // and save a wrapping container
        items: [{
            id: "panelsuperior",
            xtype: "panel",
            layout: "absolute",
            region: "north",
            border: false,
			width: "100%",
			html:"<a href='https://www.santafe.gov.ar/idesf'><img src='src/app/imagenes/encabezado-left.png' height='60px' width='25%' style='float: left; padding: 5px'/></a>" +
            "<div style='float: left; font:normal bold 30px Arial; margin: 6px;'></div>"+
			"<a href='http://www.santafe.gov.ar'><img src='src/app/imagenes/header-logo.gif' height='60px' width='15%' style='float: right; padding: 5px'/></a>" +
            "<div float='align: right; font:normal bold 30px Arial; margin: 6px;'></div>"+
            "<div style='padding-left:11px;width:100%;float:left;margin-top: 2px solid #fff; background-color:#D30A1D;font:normal 18px Arial;color:#FFFFFF; text-align:left'>Geoprocesamiento de Mapas</div>",

			bodyCfg: {style:'background-color:#FFFFFF'}
			
        },{
            id: "panelcentral",
            xtype: "panel",
            layout: "fit",
            region: "center",
            border: 1,
            items: ["mymap"]
        }, {
			id: "paneleste",
			xtype: "container",
			layout: "vbox",
			region: "west",
			width: 270,
			defaults: {
				width: "100%",
				layout: "fit"
			},
			items: [{
				title: "Arbol de Capas",
				id: "arbolCapas",
				border: false,
				flex: 1
				}, {
				title: "Lugares cercanos a Usted",
				id: "lugaresCercanos",
				height: 320,
				hidden: true,
				outputTarget: "lugaresCercanos"
					}]
			}],
        bbar: {id: "mybbar"}
    },
    
    // configuration of all tool plugins for this application
    tools: [{
        ptype: "gxp_miarbol",
        outputConfig: {
            id: "tree",
            border: true,
            tbar: [] // Los botones se agregaran en "tree.bbar" posteriormente
        },
        outputTarget: "arbolCapas"
    },
	
	{ ptype: "app_dondeestoy",outputTarget: "map.tbar"}
	

	],
    
    // layer sources
    sources: {
        local: {
            ptype: "gxp_wmscsource",
            url: "/geoserver/wms",
            version: "1.1.1"
        },        
		google: {
			ptype: "gxp_googlesource"
} ,
        ol: { ptype: "gxp_olsource" }
    },
    
    // map and layers
    map: {
        id: "mymap", // id needed to reference map in portalConfig above
       
        projection: "EPSG:900913",
        center: [-6755000.758211, -3715572.3184791],
        zoom: 12,
        layers: [
			{	
            source: "google",
            name: "ROADMAP",
            group: "background"
        }, 
		{
            // Capa Vector para mostrar nuestras geometrias y los resultados del procesamiento
            source: "ol",
            name: "sketch",
			type: "OpenLayers.Layer.Vector",
			selected: true,
			projection: "EPSG:4326",
			args: ["Area de Influencia"]
        },
		
		{
            // Capa calles   ---   Son capas SHP
            source: "local",
            name: "Idesf:bomberoszapadores",
			title: "Bomberos Zapadores",
			selected: false,
			visibility: false
        },
		{
            // Capa calles   ---   Son capas SHP
            source: "local",
            name: "Idesf:bomberosvoluntarios",
			title: "Bomberos Voluntarios",
			selected: false,
			visibility: false
        },
		{
            // Capa calles    ---   Son capas SHP
            source: "local",
            name: "Idesf:hospitales",
			title: "Hospitales",
			selected: true,
			visibility: true
        },
		{
            // Capa calles   ---   Son capas SHP
            source: "local",
            name: "Idesf:comisarias",
			title: "Comisarias",
			selected: true,
			visibility: true
        },
		{
            // Capa calles   ---   Son capas SHP
            source: "local",
            name: "Idesf:escuelas",
			title: "Escuelas",
			selected: false,
			visibility: false
        }
		],
        items: [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }]
    }

}); 
