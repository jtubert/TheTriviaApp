var conf={APIKey: '3_dmgqBSRVOZdPcxrbAKgou7dJKlzqcqASOSFW8LtFfYfIKdUAvWyfFLT5IZgt2owS',enabledProviders: 'facebook,twitter,linkedin,myspace,yahoo,google,messenger,orkut',connectWithoutLoginBehavior: 'alwaysLogin'}
com.jtubert.social = function(){
	var self = this;
	var userPhotoURL;
	var currentNetwork;
	var numOfFriends;
	
	this.init = function(numOfFriends,useImages){
		self.numOfFriends = numOfFriends;
		if(useImages){
			if(self.getUrlVars()["debug"] == "true"){
				$("#console").show();
			}else{
				$("#console").hide();
			}		
			$("#networks").change(self.changeNetwork);
		    self.changeNetwork();		

			$("#login").hide();
			$("#logout").hide();
			$("#networks").hide();		
			self.getUserInfo();
		}else{
			var main = new com.jtubert.Main(useImages);
			main.init("friends", self.userPhotoURL);
		}
		
		
	}
	
	
	
	this.shuffle = function(o){
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}
	

	this.getFriendsInfoCallback = function(response) {    
	    console.log(response); 
	
		if ( response.errorCode == 0 ) {               
	        var myFriends = response['friends'].asArray(); 
			//shuffle array
			myFriends = self.shuffle(myFriends);
      
	        if ( null!=myFriends && myFriends.length>0) {          
               
	             for (var index in myFriends) {  
	                if(index < self.numOfFriends){ 
						var currFriend = myFriends[index];  
						if(currFriend['photoURL']){
							$("#friends").append("<img alt='"+currFriend['nickname']+"' src='"+currFriend['photoURL']+"'/>");
							//$("#console").append(currFriend);
						}
					}                 
	             }

				$("#canvasHolder").append("<div id='holder'></div>");

	  			var main = new com.jtubert.Main(true,true);
				main.init("friends", self.userPhotoURL);
			
				$("#console").append($("#friends").find("img").length+ ':\n');
			
	         }  
	         else {  
	             $("#console").html('No friends were returned');  
	         }  
	     }  
	     else {  
	         $("#console").html('Error :' + response.errorMessage);  
	     }  
	 }

	this.getUserInfoCallback = function(response){
		console.log(response); 
		if ( response.errorCode == 0 ) { 
			self.userPhotoURL = response.user.photoURL;
			if(self.userPhotoURL != ""){
				$("#login").hide();
				$("#networks").hide();
				$("#logout").show();
				$("#merge").show();
				gigya.services.socialize.getFriendsInfo(conf,{callback:self.getFriendsInfoCallback}); 
			}else{
				$("#login").show();
				$("#merge").hide();
				$("#networks").show();
				$("#logout").hide();
				$("#console").html('userPhotoURL :' + self.userPhotoURL);  	
			}    
		}else{
			$("#console").html('Error :' + response.errorMessage);  
		}
	}
	
	this.getUserInfo = function(){
		gigya.services.socialize.getUserInfo(conf,{callback:self.getUserInfoCallback}); 
			 
	}
	
	this.logoutCallback = function(response) {
		 location.reload();
		
	     if ( response.errorCode == 0 ) {                   
	        $("#console").html('User has logged out');
	    	$("#login").show();
			$("#networks").show();
			$("#logout").hide();
			$("#merge").hide();
			
	     }    
	     else {    
	         $("#console").html('Error :' + response.errorMessage);
			$("#login").hide();
			$("#networks").hide();
			$("#logout").show(); 
			$("#merge").show();   
	     }    
	 }   
	   
	this.logout = function(){
		gigya.services.socialize.logout(conf,{callback:self.logoutCallback});
	} 
	
	this.onLogin = function(response){  
	     //getUserInfo();
		$("#console").html("response: "+response);   
	}	
	
	this.login = function(){
		 var params = {  
		     provider:currentNetwork,  
		     callback: 'onLogin',
			 redirectURL: document.location.href
		 }; 		   
		 gigya.services.socialize.login(conf, params); 		 
	}
	
	this.getUrlVars = function()
	{
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
	
	this.changeNetwork = function() {
		currentNetwork = $("#networks").val(); 
		$("#console").html('currentNetwork :' + currentNetwork);    
	}
	
	return this;
}