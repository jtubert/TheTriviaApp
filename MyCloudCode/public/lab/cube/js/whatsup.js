//http://whatsup-jtubert.dotcloud.com/getXML.php

com.jtubert.whatsup = function(){
	var self = this;
	var endpoint = "proxy.php?url=http://whatsup-jtubert.dotcloud.com/getXML.php";	
	var picsArray;

	this.init = function(obj){
		picsArray = [];		
		$.get(endpoint,{}, self.onData);		
	}
	
	this.onData = function(data){
		//console.log(data);
		var xmlDoc = $.parseXML( data );
		var xml = $( xmlDoc );
		var thumbnails = xml.find('image');
		$.each(thumbnails, function(i,item){
			picsArray.push($(item).text());
		});
		com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
		
	}	
	
	return this;
}
