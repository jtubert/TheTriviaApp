//http://instagram.com/developer/

com.jtubert.instagram = function(){
	var self = this;
	var token = "";
	var user = "";
	var endpoint = "https://api.instagram.com/v1/";
	var userPhotoURL = "";

	this.init = function(){
		$("#canvasHolder").append("<div id='holder'></div>");
		self.getAccessToken();
		self.userInfo();
	}

	this.getAccessToken = function(){
		if(window.location.hash) {
		    var hash = window.location.hash.substring(1); 
		    self.token = hash.split("=")[1];
		}
	}

	this.userMediaRecent = function(uid){
		var id =(uid == null)?"self":uid;
	
		$("#grams").html("");
	
		var url = endpoint+"users/"+id+"/media/recent/?access_token="+self.token+"&callback=callbackFunction";
		self.loadWithURL(url,self.userMediaRecentSuccess,"grams");
	}

	this.userInfo = function(){
		var url = endpoint+"users/self/?access_token="+self.token+"&callback=callbackFunction";
		self.loadWithURL(url,self.userInfoSuccess,"user");
	}

	this.userSelfFeed = function(){
		var url = endpoint+"users/self/feed/?access_token="+self.token+"&callback=callbackFunction";
		self.loadWithURL(url,self.userMediaRecentSuccess,"selfFeed");
	}

	this.userFollows = function(){
		var url = endpoint+"users/self/follows/?access_token="+self.token+"&callback=callbackFunction";
		self.loadWithURL(url,self.userFollowsSuccess,"user");
	}

	this.loadWithURL = function(url,callback,div){
		$.ajax({
	      url: url,
	      dataType: 'jsonp',
	      success: function(obj){callback(obj,div);}
	    });
	}

	this.showFeedForUser = function(uid){
		self.userMediaRecent(uid);
	}

	this.userFollowsSuccess = function(obj,divName){
	    //console.log("data",obj);
	
		var div = "";
		var len = (obj.data.length >= 10)?10:obj.data.length;
	
		for(var i=0;i<len;i++){
			var data = obj.data[i];
			
			$("#friends").append("<img alt='"+data.username+"' src='"+data.profile_picture+"'/>");
		}

	
	
	
	
		//$("#"+divName).append(div);
		
		var main = new com.jtubert.Main(true,true);
		main.init("friends", self.userPhotoURL);
	
	
	
		var next_url = obj.pagination.next_url;
		if(next_url){
			//self.loadWithURL(next_url,self.userFollowsSuccess,divName);
		}else{
			
		}
	
	}

	this.userInfoSuccess = function(obj,divName){
	    console.log("data",obj);
		user = obj.data.id;
	
	
		self.userPhotoURL = obj.data.profile_picture;
	
		$("#login").html("");
	
		
		
		
		self.userFollows();
	}

	this.userMediaRecentSuccess = function(obj,divName){
	    //console.log("data",obj);
		var len = obj.data.length;
	
		for(var i=0;i<len;i++){
			var data = obj.data[i];
			var imageURL = data.images.low_resolution.url;
			var thumbURL = data.images.thumbnail.url;
			var captionObject = data.caption;
			var link = data.link;
			var filter = data.filter;
			var user = data.user.full_name;
		
			var caption = "{No caption}";
		
			if(captionObject){
				caption = captionObject.text;
			}
		
			var div = "<div class='inst'>";
			div+="<a href='"+link+"'><img src='"+thumbURL+"'></img></a>";
			div+="<h2>{"+user+"} "+caption+"</h2>";
			div+="<h3><b>Filter: </b>"+filter+"</h3>";
			div+="</div>";

			$("#"+divName).append(div);
		}
	
		var next_url = obj.pagination.next_url;
	
		if(next_url){
			self.loadWithURL(next_url,self.userMediaRecentSuccess,divName);
		}else{
			$('.scroll-pane').jScrollPane();
				$('.scroll-pane-arrows').jScrollPane(
					{
						showArrows: true,
						horizontalGutter: 10
					}
				);
		}
	}
	
	return this;
}
