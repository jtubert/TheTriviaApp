var family = new function(){
		this.init = function() {
			window.twitter_images = new Array();
			var hashtag = "lebron9";

			var url = "http://search.twitter.com/search.json?q=filter%3Aimages%20OR%20instagr.am%20OR%20pic.twitter.com%20%23"+hashtag+"&include_entities=true&rpp=50&callback=?";

			family.getimages(url);

			window.setTimeout(function() {  
				if(twitter_images.length > 0){
					family.displayimages();
				}
			}, 6000); 

			

		};
		this.displayimages = function(){
			var str = "";
			var more_str= "";
			$.each(twitter_images, function(index, value) { 
				//console.log(index + ': ' + value);

				//the first 9 images
				if(index < 9){
					str += "<div class='tw_img' style='background:url("+value+") no-repeat'></div>";
				}
				//numebr 10
				if(index == 9){
					str += "<div class='see_more'></div>";
					more_str += "<div class='tw_img' style='background:url("+value+") no-repeat'></div>";
				}
				//all the rest
				if(index > 9){
					more_str += "<div class='tw_img' style='background:url("+value+") no-repeat'></div>";
				}

			});

			$('body').append('<div id="family_overlay"> <div class="inner_container"> <div class="more_twitter"> <div class="images">'+ str + more_str+'</div> </div> </div> </div>');

			
			var title_cache = '<h4>'+ $('div#family div.content').attr('data-title') +'<span>'+ $('div#family div.content').attr('data-subtitle') +'</span></h4>';
			$('#family_overlay .inner_container').prepend(title_cache);
			//Cufon.replace('#family_overlay .inner_container h4', {'fontFamily' : 'Futura'}); 

			var family_overlay =  $('div#family_overlay');
			//family_overlay.fadeOut();

			

			$('#family_overlay').html(str);

			$('div#family div.see_more').click(function(){
				//console.log('see more');
				family_overlay.css('z-index','2147483647');
				family_overlay.fadeIn();	
			});

		};
		this.getimages = function(url) {

			//console.log("family twitter: "+ url);
			$.getJSON(url, function(data) {
				//console.log(data);

				//if there are results
				if(data.results.length > 0){
			        $.each(data.results,function(index, value){

			            var this_tweet = value;
			            //console.log(this_tweet);

			            var text = this_tweet.text;
			            var who = this_tweet.from_user;

			            // tweets from @rpatrickd are blocked
			            if(who != "rpatrickd"){
			            	 if(this_tweet.entities.media){
						            var imageurl = this_tweet.entities.media[0].media_url;
						            //console.log(imageurl);
						            twitter_images.push(imageurl);
					            }
					            if(this_tweet.entities.urls){
					            	var display_url = this_tweet.entities.urls[0].display_url;
					            	var expanded_url = this_tweet.entities.urls[0].expanded_url;
					            	if(display_url.match("instagr") != null){
					            		//console.log("i am instagram");
					            		//use this to make second request
					            		var get_photo = "http://instagr.am/api/v1/oembed/?url="+expanded_url+"&maxwidth=150&callback=?"; 
					            		//console.log("instagram request: "+ get_photo);
					        			$.getJSON(get_photo, function(data) {
					        				var imageurl = data.url;
					        				//console.log(imageurl);
					        				twitter_images.push(imageurl);
					        		    });

					            	}else if(display_url.match("twitpic") != null){
					            		//console.log("i am twitpic");
					            		var twitpic_id = display_url.split('twitpic.com/')[1];
					            		var twitpic = "http://twitpic.com/show/thumb/"+twitpic_id;
					            		twitter_images.push(twitpic);

					            	}else if(display_url.match("yfrog") != null){
					            		//console.log("i am yfrog");
					            		var yfrog_id = display_url.split('yfrog.com/')[1];
					            		var yfrog = "http://yfrog.com/"+yfrog_id+":medium";
					            		twitter_images.push(yfrog);

					            	}else if (display_url.match("lockerz") != null){
					            		var lockerz_id = display_url.split('lockerz.com/s/')[1];
					            		var lockerz = "http://api.plixi.com/api/tpapi.svc/imagefromurl?url=http://plixi.com/p/"+lockerz_id+"&size=small";
					            		twitter_images.push(lockerz); 
					            	}

					            }

			            	}

				        });
				}else{
					console.log('no twitter image results');
				}

		    });
		};
	};

//family.init();