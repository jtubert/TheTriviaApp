//http://localhost:8888/git/canvas/portrait/?mode=google&q=supermariobros&url=https://sphotos-b.xx.fbcdn.net/hphotos-prn1/65106_10151174034757338_205778102_n.jpg
com.jtubert.GoogleImageSearch = function(){
	var self = this;	
	var endpoint = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0";
	var googleImageResults = [];
	var start = 0;

	self.init = function(obj){		
		self.search(start,obj.q,obj.img,obj.limit);	
	}

	self.getImage = function(url){
		var img = new Image();
		  img.onload = function(e) {
		  	var canvas = document.getElementById('mainImage');
        	var ctx = canvas.getContext('2d');
		    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		    //return canvas.toDataURL(); // Succeeds. Canvas won't be dirty.
		    console.log(e);
		    $("#holder").append("<img src='"+canvas.toDataURL()+"'/>");
		  };
		  img.crossOrigin = 'anonymous';
		  
		  console.log(url);

		  img.src = "/proxied_image?image_url="+url;
	}
	
	self.search = function(startNumber,q,img,limit){
	    $.getJSON("https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+q+"&start="+startNumber+"&callback=?", function(results){

			//console.log(results);
			if(results.responseDetails){
				alert("Sorry. Google only allows a certain number of requests.");
				return;
			}

			if(results.responseData){
				var r = results.responseData.results;				
				for(var i=0;i<r.length;i++){					
					//googleImageResults.push(r[i].url);
					//$("#holder").append("<img src='"+r[i].tbUrl+"'/>");

					self.getImage(r[i].tbUrl);
				}
				
				var total = 20;
				
				if(limit){
					total = limit;
				}
								
		        if($("#holder").find("img").length < total){
		            start = start + 4;
		            self.search(start,q,img,limit);
		        }else{
					portrait.allInstagramImagesLoaded(img);
				}			
			}else{				
				portrait.allInstagramImagesLoaded(img);
			}

	    });
	}	
	return this;
}








