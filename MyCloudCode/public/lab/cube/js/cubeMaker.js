com.jtubert.cubeMaker = function(){
	var self = this;
	
	var numOfFriends = 0;
	var cubeFaceSize = 200;
	var imagePerFace = 1;
	
	
	this.init = function(){
		self.numOfFriends = numOfFriends;
		self.cubeFaceSize = cubeFaceSize;
		self.imagePerFace = imagePerFace;
		
		
		self.numOfFriends = (self.imagePerFace*6)+1;
	}
	
	this.setCSS = function(){			
		var size = self.cubeFaceSize / Math.sqrt(self.imagePerFace);		
		jQuery('.grid').css({"width":""+size+"px"});
		jQuery('.grid').css({"height":""+size+"px"});
	}
	
	this.clearCube = function(){
		jQuery("#front").html('');
		jQuery("#back").html('');
		jQuery("#side1").html('');
		jQuery("#side2").html('');
		jQuery("#bottom").html('');
		jQuery("#top").html('');
	}
	
	this.setImagesPerFace = function(num){
		self.imagePerFace = num;
		self.numOfFriends = (self.imagePerFace*6)+1;
	}
	
	this.refresh = function(){
		self.putImagesOnCube(self.picsArray);
	}
	
	
	this.putImagesOnCube = function(picsArray){
		
		
		
		self.picsArray = picsArray;
		
		//console.log(picsArray.length);
		
		//clear all previus images
		self.clearCube();
		
		var len = (picsArray)?picsArray.length:self.numOfFriends;		
		var arr = [];
		
		if(picsArray){
			var originalLen = picsArray.length;		
			//if less than numOfFriends friends fill the rest with the same piuctures
			if(arr.length < self.numOfFriends){
				while(arr.length < self.numOfFriends){
					var rand = Math.abs(Math.round(Math.random()*originalLen-1));				
					arr.push(picsArray[rand]);
				}
			}		
			//console.log(originalLen);
			$("#numberOfPhotos").html("Total photos available: "+ originalLen + ", "+ (arr.length-1) + " needed for "+self.imagePerFace+" image/s per face.");
		}
		
		len = arr.length || self.numOfFriends;
		
		for(var i=0;i<len;i++){			
			if(i < self.numOfFriends){			
				
				
				var currentCubeFace = "";							

				if(i > 0 && i <= self.imagePerFace){
					currentCubeFace = "#front";
				}else if(i > self.imagePerFace && i <= (self.imagePerFace*2)){
					currentCubeFace = "#back";
				}else if(i > (self.imagePerFace*2) && i <= (self.imagePerFace*3)){
					currentCubeFace = "#side1";
				}else if(i > (self.imagePerFace*3) && i <= (self.imagePerFace*4)){
					currentCubeFace = "#side2";
				}else if(i > (self.imagePerFace*4) && i <= (self.imagePerFace*5)){
					currentCubeFace = "#bottom";
				}else if(i > (self.imagePerFace*5) && i <= (self.imagePerFace*6)){
					currentCubeFace = "#top";
				}
				//console.log(i,currentCubeFace);
				var url = "face.jpg";
				
				if(picsArray && arr[i] != ""){
					url = arr[i];
					//console.log(url);
				}
				
				
				jQuery(currentCubeFace).append("<img class='grid' src='"+url+"'/>");
				
				//$(currentCubeFace).append(picsArray[i]);
			}		
		}
		
		
		self.setCSS();
	}
	
	return this;
}




















