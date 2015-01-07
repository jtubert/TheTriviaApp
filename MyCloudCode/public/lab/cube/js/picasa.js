//https://picasaweb.google.com/data/feed/api/user/jtubert
com.jtubert.picasa = function(){
	var self = this;
	var endpoint = "http://picasaweb.google.com/data/feed/api/user/";	
	var picsArray;

	this.init = function(obj){
		picsArray = [];		
		var url = endpoint + obj.username;
		$.get(url,{}, self.onData);		
	}
	
	this.onData = function(data){
		//console.log(data);
		//var xmlDoc = $.parseXML( data );
		var xml = $( data );
		//var thumbnails = xml.find('[nodeName="media:thumbnail"]');
		
		var thumbnails = xml.find('media\\:thumbnail');
		
		
		$.each(thumbnails, function(i,item){
			picsArray.push($(item).attr("url"));
		});
		com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
		
	}	
	
	return this;
}
