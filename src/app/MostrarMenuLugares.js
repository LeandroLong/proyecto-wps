

var MostrarMenuLugares=Ext.extend(gxp.plugins.Tool,{
	
	ptype:"app_mostrarmenulugares",
	
	featureManager:null,
	
	autoHide:!1,
	
	schema:null,
	
	outputAction:0,
	
	autoExpand:null,
	
	outputTarget: "lugaresCercanos",
	
	hidden: true,


	addOutput:function(a){
			
					
	MostrarMenuLugares.superclass.addOutput.call(this,a)},
		
	removeOutput:function(){
			
					
	MostrarMenuLugares.superclass.removeOutput.call(this)}	
		
		});


Ext.preg(MostrarMenuLugares.prototype.ptype,MostrarMenuLugares);