com.jtubert.flickr = function(){
	var self = this;
	var token = "";
	var user = "";
	var endpoint = "http://api.flickr.com/services/feeds/photos_public.gne?";	
	var picsArray;

	this.init = function(obj){
		picsArray = [];		
		var url = endpoint + "id="+obj.userid+"&tags="+obj.tags+"&lang=en-us&format=json&jsoncallback=?";
		
		$.getJSON(url,{}, self.onData);		
	}
	
	this.onData = function(data){
		$.each(data.items, function(i,item){
			picsArray.push(item.media.m);
		});
		
		com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
	}	
	
	return this;
}
