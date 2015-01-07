com.jtubert.rssfeed = function(){
	var self = this;
	var endpoint = "proxy.php?url=";	
	var picsArray;

	this.init = function(obj){
		picsArray = [];		
		var url = endpoint + obj.feed;
		$.get(url,{}, self.onData);	
		//var url = "http://jsonp.guffa.com/Proxy.ashx?url=" +  encodeURIComponent(obj.feed);
		//console.log(url);
		//$.get(url, {}, self.onData,"jsonp");
		
	}

	function test(data){
		console.log(data);
	}
	
	this.onData = function(data){
		//console.log(data);
		//var xmlDoc = $.parseXML( data );
		
		var xml = $( data );
		//var thumbnails = xml.find('[nodeName="media:content"]');
		var thumbnails = xml.find('media\\:content');
		
		
		$.each(thumbnails, function(i,item){
			picsArray.push($(item).attr("url"));
		});
		com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
		
	}	
	
	return this;
}
