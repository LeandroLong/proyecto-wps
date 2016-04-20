

var MostrarMenuStep=Ext.extend(gxp.plugins.Tool,{
	
	ptype:"app_mostrarmenustep",
	
	featureManager:null,
	
	autoHide:!1,
	
	schema:null,
	
	outputAction:0,
	
	autoExpand:null,
	
	outputTarget: "paneloeste",


	addOutput:function(a){
			
					
	MostrarMenuStep.superclass.addOutput.call(this,a)},
		
	removeOutput:function(){
			
					
	MostrarMenuStep.superclass.removeOutput.call(this)}	
		
		});


Ext.preg(MostrarMenuStep.prototype.ptype,MostrarMenuStep);