//https://developer.foursquare.com

com.jtubert.foursquare = function(){
	var self = this;
	var endpoint = "https://api.foursquare.com/v2/";
	var token;
	var picsArray;

	this.init = function(obj){		
		picsArray = [];	
		
		var localurl = encodeURIComponent("http://localhost:8888/git/cube/?mode=foursquare");
		
		if(window.location.href.indexOf("http://localhost") == 0){
			$("#login").append("<a href='https://foursquare.com/oauth2/authenticate?client_id=E531V5431ZCCG4CRK32SFAYCDX4XSUEEAZFNDMSGV42EMV1M&response_type=token&redirect_uri="+localurl+"'>Add foursquare images</a>");
		}else{
			$("#login").append("<a href='https://foursquare.com/oauth2/authenticate?client_id=E531V5431ZCCG4CRK32SFAYCDX4XSUEEAZFNDMSGV42EMV1M&response_type=token&redirect_uri=http://localhost:8888/git/cube/?mode=foursquare'>Add foursquare images</a>");
		}		
		
		$("#canvasHolder").append("<div id='holder'></div>");
		self.getAccessToken(obj);
		
	}

	this.getAccessToken = function(obj){
		if(window.location.hash) {
		    var hash = window.location.hash.substring(1); 
		    self.token = hash.split("=")[1];
			
			$("#login").html("");
			
			self.getPhotos();
		}
	}

	this.getPhotos = function(){
		var url = endpoint+"users/self/photos?oauth_token="+self.token+"&v=20121024";
		self.loadWithURL(url,self.onGetPhotos,"user");
	}
	
	
	this.checkins = function(){
		var url = endpoint+"users/self/checkins?oauth_token="+self.token+"&v=20121024";
		//console.log(url);
		
		self.loadWithURL(url,self.onCheckin,"user");
	}
	
	this.onCheckin = function(obj,div){
		console.log(obj.response.checkins.items[0].venue.name);
	}
	
	this.onGetPhotos = function(obj,div){
		//console.log(obj);
		
		var items= obj.response.photos.items;
		for(var i=0;i<items.length;i++){
			var item = items[i];
			picsArray.push(item.prefix+"200x200"+item.suffix);			
		}	
		com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
	}
	

	this.loadWithURL = function(url,callback,div){
		$.ajax({
	      url: url,
	      dataType: 'jsonp',
	      success: function(obj){callback(obj,div);}
	    });
	}

	
	
	return this;
}
