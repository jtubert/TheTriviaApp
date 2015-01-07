
var conf={APIKey: '3_dmgqBSRVOZdPcxrbAKgou7dJKlzqcqASOSFW8LtFfYfIKdUAvWyfFLT5IZgt2owS',enabledProviders: 'facebook,twitter,linkedin,myspace,yahoo,google',connectWithoutLoginBehavior: 'alwaysLogin'}
com.jtubert.social = function(){
	var self = this;
	var userPhotoURL;
	var currentNetwork = "facebook";
	var numOfFriends = 0;
	var cubeFaceSize = 200;
	var imagePerFace = 9;
	
	this.init = function(){
		
		
		
		
		if (self.getUrlVars().imagePerFace) {
            imagePerFace = Number(self.getUrlVars().imagePerFace);
        }
		
		
		numOfFriends = (imagePerFace*6)+1;
		
		self.imagePerFace = imagePerFace;
		self.cubeFaceSize = cubeFaceSize;
		self.numOfFriends = numOfFriends;
		
		if(window.location.hash) {
			instagram = com.jtubert.instagram();
			instagram.init();
			return;
		}
		
		
		$("#networks").change(self.changeNetwork);
	    self.changeNetwork();
	
		//self.getSessionInfo();
		
		self.getUserInfo();
		
		

		gigya.socialize.addEventHandlers({ 
			onLogin:self.displayEventMessage,
		    onConnectionAdded:self.displayEventMessage,
		    onConnectionRemoved:self.displayEventMessage
		   }
		);
		
		
		
		var connect_params=
		{
			showTermsLink: 'false'
			,showEditLink: 'true'
			,height: 70
			,width: 300
			,containerID: 'connectionsUIHolder'
			,UIConfig: '<config><body><controls><snbuttons buttonsize="40" /></controls></body></config>'
		}
		
		gigya.services.socialize.showAddConnectionsUI(connect_params);
		
		
		
	}
	

	this.displayEventMessage=function(eventObj) {
	    //console.log(eventObj.provider);
	
		//if(eventObj.eventName == "connectionAdded"){
			currentNetwork = eventObj.provider;
			gigya.services.socialize.getFriendsInfo(conf,{callback:self.getFriendsInfoCallback}); 
		//}
	}
	
	this.shuffle = function(o){
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}
	
	this.setCSS = function(){			
		var size = cubeFaceSize / Math.sqrt(imagePerFace);		
		jQuery('.grid').css({"width":""+size+"px"});
		jQuery('.grid').css({"height":""+size+"px"});
		
		console.log(size);
	}
	
	this.getFriendsInfoCallback = function(response) {    
	    //console.log(response);
	
		if ( response.errorCode == 0 ) {
			
			//clear all previus images
			jQuery("#front").html('');
			jQuery("#back").html('');
			jQuery("#side1").html('');
			jQuery("#side2").html('');
			jQuery("#bottom").html('');
			jQuery("#top").html('');
			
			               
	        var myFriends = response['friends'].asArray();
			myFriends = self.shuffle(myFriends);
			
			var originalLen = myFriends.length;
			
			//if less than numOfFriends friends fill the rest with the same piuctures
			if(myFriends.length < numOfFriends){
				while(myFriends.length < numOfFriends){
					var rand = Math.abs(Math.round(Math.random()*originalLen-1));
					//console.log(rand);
					myFriends.push(myFriends[rand]);
				}
			}
	
	 		myFriends = self.shuffle(myFriends);
			
			jQuery("#friends").html('<h1>You need '+numOfFriends+' friends to fill the cube, and you have: '+originalLen+'</h1>');
			
	        if ( null!=myFriends && myFriends.length>0) {          
               
	             for (var index=0;index<myFriends.length;index++) {  
	                if(index < numOfFriends){ 
						var currFriend = myFriends[index];  
						
							//var identities = currFriend['identities'];
							var prov = "";
							/*
							for (var prop in identities) {
							    prov = prop;
							    break;
							}*/
							
							var currentCubeFace = "";							
							
							if(index > 0 && index <= imagePerFace){
								currentCubeFace = "#front";
							}else if(index > imagePerFace && index <= (imagePerFace*2)){
								currentCubeFace = "#back";
							}else if(index > (imagePerFace*2) && index <= (imagePerFace*3)){
								currentCubeFace = "#side1";
							}else if(index > (imagePerFace*3) && index <= (imagePerFace*4)){
								currentCubeFace = "#side2";
							}else if(index > (imagePerFace*4) && index <= (imagePerFace*5)){
								currentCubeFace = "#bottom";
							}else if(index > (imagePerFace*5) && index <= (imagePerFace*6)){
								currentCubeFace = "#top";
							}
							//console.log(index,currentCubeFace);
							if(currFriend['photoURL']){
								jQuery(currentCubeFace).append("<img class='grid' alt='"+index+"/"+prov+"/"+currFriend['nickname']+"' src='"+currFriend['photoURL']+"'/>");
							}else{
								jQuery(currentCubeFace).append("<div style='background-color:blue;' class='grid' alt='"+index+"/"+prov+"/"+currFriend['nickname']+"'/>");
							}
							//$("#console").append(currFriend);
						
					}                 
	             }
				self.setCSS();
	         }  
	         else {  
	             $("#console").html('No friends were returned');  
	         }  
	     }  
	     else {  
	         $("#console").html('Error :' + response.errorMessage);  
	     }  
	 }
	
	this.getSessionInfo = function(){
		gigya.services.socialize.getSessionInfo(conf,{provider:currentNetwork,callback:self.getSessionInfoCallback});
	}

	this.getSessionInfoCallback = function(response){
		if ( response.errorCode == 0 ) {               
			var authToken = response['authToken'];
			console.log("authToken: ",response);
			self.getUserInfo();
		}else{
			console.log('Error/getSessionInfoCallback :',response);  
		}
	}
	
	this.addConnection = function(p)
    {

        var params = {
           callback: self.onConnectionAdded,
		   facebookExtraPermissions: "publish_stream",
           provider: p

        };    

        gigya.services.socialize.addConnection(conf, params);	

    }

    this.onConnectionAdded = function(response)
    {
        console.log(response.requestParams.provider);

		self.getAvailableProviders();

		if (response.errorCode == 0)
        {            
            //jQuery('#canvasHolder').append("<h2>"+response.user.identities[response.requestParams.provider].nickname+"</h2>");
			//jQuery('#canvasHolder').append("<img src='"+response.user.identities[response.requestParams.provider].photoURL+"'/>");          
			//gigya.services.socialize.getFriendsInfo(conf,{callback:self.getFriendsInfoCallback}); 
			
			self.getSessionInfo();
        }
        else
        {
            //handle errors
            $("#console").html("An error has occurred!" + '\n' + 
                "Error details: " + response.errorMessage + '\n' +
                "In method: " + response.operation);
        }
    }
	
	this.getAvailableProviders = function(){
		var context = {  
		    message:'This is my message to you',   
		    myAppTitle:'These are my providers:'  
		};


		var params = {  
		    requiredCapabilities: 'friends',   
		    callback:self.printResponse,  
		    context:context   
		};  

		gigya.services.socialize.getAvailableProviders(conf,params);
	}
	
	this.printResponse = function(response) {
		console.log(response);
	}

	this.getUserInfoCallback = function(response){
		console.log("You are logged in to: ",response.user.providers);
		
		if ( response.errorCode == 0 ) { 
			self.userPhotoURL = response.user.photoURL;
			if(self.userPhotoURL != ""){
				//$("#login").hide();
				//$("#networks").hide();
				//$("#logout").show();
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
		 //gigya.services.socialize.login(conf, params); 
		
		self.addConnection(currentNetwork);		 
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
		//currentNetwork = $("#networks").val(); 
		//$("#console").html('currentNetwork :' + currentNetwork);    
	}
	
	return this;
}