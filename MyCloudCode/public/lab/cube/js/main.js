com.jtubert.main = function(){
	var self = this;
	var mouseX,mouseY;
	
	this.init = function(){		
		
		$(document).bind('mousemove', self.onDocumentMouseMove);
		$(document).bind('touchmove', self.onMobileMove);		
		
		//cube with default picture
		com.jtubert.cubeMakerInstance = new com.jtubert.cubeMaker();
		com.jtubert.cubeMakerInstance.init();
		com.jtubert.cubeMakerInstance.putImagesOnCube();
		
		if(self.getUrlVars().mode){
			$("h1").html("Cube Maker: "+self.getUrlVars().mode);
		}
		
		if(self.getUrlVars().mode.indexOf("gigya") == 0){
			//cube with pictures from FB, TW, LinkedIn
			var gigya = com.jtubert.gigya();
			gigya.init();
		}else if(self.getUrlVars().mode.indexOf("instagram") == 0 ){
			var t = "userInfo";
			
			if(self.getUrlVars().type == "userInfo"){
				t = "userInfo";
			}else if(self.getUrlVars().type == "userSelfFeed"){
				t = "userSelfFeed";
			}else if(self.getUrlVars().type == "userFollows"){
				t = "userFollows";
			}			
			//cube with pictures from instagram
			var instagram = com.jtubert.instagram();
			instagram.init({type:t});//userSelfFeed userFollows userInfo
		}else if(self.getUrlVars().mode.indexOf("flickr") == 0){
			
			var userid = "44124460439@N01";
			var tags = "furniture";
			
			if(self.getUrlVars().userid){
				userid = self.getUrlVars().userid;
			}
			
			if(self.getUrlVars().tags){
				tags = self.getUrlVars().tags;
			}
			
			//cube with pictures flickr
			var flickr = com.jtubert.flickr();
			flickr.init({tags:tags,userid:userid});
		}else if(self.getUrlVars().mode.indexOf("picasa") == 0){
			var username = "jtubert";			
			if(self.getUrlVars().username){
				username = self.getUrlVars().username;
			}			
			
			//cube with pictures from Picasa/Google+
			var picasa = com.jtubert.picasa();
			picasa.init({username:username});
		}else if(self.getUrlVars().mode.indexOf("whatsup") == 0){
			//cube with pictures from whatsup
			var whatsup = com.jtubert.whatsup();
			whatsup.init();
		}else if(self.getUrlVars().mode.indexOf("rssfeed") == 0){
			
			//http://www.nytimes.com/services/xml/rss/nyt/Travel.xml
			var feed = "http://www.nytimes.com/services/xml/rss/nyt/Arts.xml";			
			if(self.getUrlVars().feed){
				feed = self.getUrlVars().feed;
			}
			
			
			//cube with pictures from any rss feed
			var rssfeed = com.jtubert.rssfeed();
			rssfeed.init({feed:feed});
		}else if(self.getUrlVars().mode.indexOf("foursquare") == 0){
			//cube with pictures from foursquare
			var foursquare = com.jtubert.foursquare();
			foursquare.init();
		}		
		
		var currentValue = 1;
		
		$( "#slider-1" ).bind( "change", function(event, ui) {
		  	if(currentValue != this.value){
				var val = this.value*this.value;
				com.jtubert.cubeMakerInstance.setImagesPerFace(val);
				com.jtubert.cubeMakerInstance.refresh();
				currentValue = this.value;
			}			
		});		
	}
	
	this.getCubeMaker = function(){
		return cubeMaker;
	}	
	
	this.onMobileMove = function(e) {
		
		e.preventDefault() ;
		var x = e.originalEvent.pageX;
	    var y = e.originalEvent.pageY;
	
		//console.log(x,y);
	
		self.onDocumentMouseMove({pageX:x,pageY:y});
	};

	this.onDocumentMouseMove = function(event){
	    mouseX = ( event.pageX - window.innerWidth/2 );
	    mouseY = ( event.pageY - window.innerHeight/2 );
		$('#cube').css('-webkit-transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
		$('#cube').css('-moz-transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
		$('#cube').css('-ms-transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
		$('#cube').css('-o-transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
		$('#cube').css('transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
		
		
		// track mouse/finger
					

					
		
		
		
		
	}
	
	this.getUrlVars = function(){
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}
		
	
	return this;
}




















