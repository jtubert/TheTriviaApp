/**
 * This is a namespace.
 *
 * @namespace com.jtubert
 */
var com = {jtubert:{ColorGenius:{}}};

/**
 * Some function.
 *
 * @class com.jtubert.ColorGenius
 * @return {ColorGenius} Self.
 */
com.jtubert.ColorGenius = function() {
    /*jslint browser: true, debug: true, eqeqeq: false, undef: false */

	var self = this;
	var url;
	var usePhpProxy;
	
	/**
	 * This is the init method of the ColorGenius
	 *
	 * @method init
	 * @param {String} imgID Img id
	 * @return {void} Doesn't return anything.
	 */
    self.init = function(url) {		
		if (com.jtubert.ColorGenius.Utils.getUrlVars().url) {
            url = com.jtubert.ColorGenius.Utils.getUrlVars().url;
        }
		
		
		self.loadImage(url);
    };

	/**
	 * This method loads the image and calls the createPuzzle method
	 *
	 * @method loadImage
	 * @param {String} url Url of image to be used for the puzzle.
	 * @return {void} Doesn't return anything.
	 */
    self.loadImage = function(url){
        if(!usePhpProxy && url.indexOf("http://") > -1){
            $.getImageData({
                url: url,
                success: function(image) {
					//reduce image size so it iterates thru less pixels
					image.width=50;
					image.height=50;
					self.getColorsFromImage(image,url);

                },
                error: function(xhr, text_status) {
                    alert("Error!");
                }
            });
        }else{
            img = new Image();
            img.onload = function(){
                //reduce image size so it iterates thru less pixels
				img.width=50;
				img.height=50;
                self.getColorsFromImage(img,url);                
            };

            if(url.indexOf("http://") >= 0){
                img.src = "imageProxy.php?url="+url;
            }else{
                img.src = url;
            }
        }    
    };	
	
    

	self.makeCanvasFromImage = function(img,index,w,x){
		//get the image width and height
		var imageW = img.width;
		var h = img.height;
		
		
		var canvasWrapper = $("<canvas style='z-index:"+index+"' id='img"+index+"' width='" + imageW + "'height='" + h + "'></canvas>").appendTo("body");
		var layer = document.getElementById("img"+index);
        var ctx = layer.getContext("2d");
		ctx.drawImage(img, 0, 0,w,h);	
		
		
		
		return layer;
	}

	self.getColorsFromImage = function(img,url){
		//add image at full size
		$("<img src="+img.src+"></img>").appendTo("#image");
		
		
		
		
		
		
		//
		var layer = self.makeCanvasFromImage(img, 1, img.width, 0);
		var ctx = layer.getContext("2d");
		var pixelArray = [];
		var w = ctx.canvas.width;
		var h = ctx.canvas.height;
		
		for (var y=0;y<h;++y){
			for (var x=0;x<w;++x){
		    	var p = ctx.getImageData(x, y, 1, 1).data; 
				pixelArray.push([p[0], p[1], p[2]]);
			}
		}
		
		var cmap = MMCQ.quantize(pixelArray, 10);
	    var palette = cmap.palette();
		var utils = com.jtubert.ColorGenius.Utils;
		
		var h = $("#image").css("height").replace("px","");
		var imageW = $("#image img").css("width").replace("px","");
		var stripeW = (Number(imageW)+50)/palette.length;
		var imageH = Number(h)+50;
		
		//console.log(imageH,imageW)
		
		for(var i=0;i<palette.length;i++){
			
			var r = palette[i][0];
			var g = palette[i][1];
			var b = palette[i][2];
			
			var hex = "#" + ("000000" + utils.rgbToHex(r, g, b)).slice(-6);
			self.drawColorbox(hex,stripeW,imageH);
			
			self.findFlickrPhotoByColor(hex);
			
			
			
			//console.log(hex);
		}
		/*
		var closetColor = self.getClosestColor(palette,{r:0,g:0,b:255});
		var closetColorHex = "#" + ("000000" + utils.rgbToHex(closetColor.r, closetColor.g, closetColor.b)).slice(-6);
		self.drawColorbox(closetColorHex,30,30);
		
		var closetColor = self.getClosestColor(palette,{r:0,g:0,b:0});
		var closetColorHex = "#" + ("000000" + utils.rgbToHex(closetColor.r, closetColor.g, closetColor.b)).slice(-6);
		self.drawColorbox(closetColorHex,30,30);
		
		var closetColor = self.getClosestColor(palette,{r:255,g:0,b:0});
		var closetColorHex = "#" + ("000000" + utils.rgbToHex(closetColor.r, closetColor.g, closetColor.b)).slice(-6);
		self.drawColorbox(closetColorHex,30,30);
		*/
		
		//remove canvas
		$("#img1").remove();		
	}
	
	self.findFlickrPhotoByColor = function(hex){
		var hex = hex.substr(1,7);
		//console.log(hex);
		
		function showImage(data){
			var h = $("#image").css("height").replace("px","");
			$("#similarImages").css("top",Number(h)+60)
			
			var filepath = data.result[0].filepath;
			var url = "http://img.tineye.com/flickr-images/?filepath=labs-flickr/"+filepath+"&size=128";
			$("<img src="+url+"></img>").appendTo("#similarImages");
		}
		
		//http://labs.ideeinc.com/multicolr#colors=83bfb4;weights=100;
		var url = encodeURIComponent("http://labs.ideeinc.com/rest/?method=flickr_color_search&limit=1&offset=0&colors%5B0%5D="+hex+"&weights%5B0%5D=1");
		
		$.ajax({
		  url: "imageProxy.php?route="+url,
		  dataType: 'json',
		  success: showImage
		});
		
		
	}
	
	self.getClosestColor = function(palette,color){
		var utils = com.jtubert.ColorGenius.Utils;
		
		//console.log("color",color);
		
		var labColor1 = utils.rgb2lab(color.r,color.g,color.b);
		var dis = null;
		var closestColor;
		
		for(var i=0;i<palette.length;i++){
			var r = palette[i][0];
			var g = palette[i][1];
			var b = palette[i][2];
			
			var labColor2 = utils.rgb2lab(r,g,b);
			var d = utils.deltaE(labColor1,labColor2);
			
			//console.log(d);
			
			if(dis == null || dis > d){
				dis = d;
				closestColor = {r:r,g:g,b:b,dis:d};
			}
		}
		//console.log("closestColor: ",closestColor);
		return closestColor;
		
	}
	
	self.drawColorbox = function(hexcolor,w,h){
		var ele = $("<li><div style='border-color:white;border-style:solid;border-width:0px;width:"+w+"px; height:"+h+"px;position:relative;background-color:"+hexcolor+"'></div></li>").appendTo("#backg ul");
	}
	
	return this;
};


com.jtubert.ColorGenius.Utils = new function() {
    var self = this;

	self.deltaE = function(lab1, lab2)
	{
		var delta_L = lab1.l - lab2.l;
		var delta_a = lab1.a - lab2.a;
		var delta_b = lab1.b - lab2.b;

		return Math.sqrt(delta_L * delta_L + delta_a * delta_a + delta_b * delta_b);
	}
	
	self.rgb2lab = function(R, G, B){
		var xyz = self.rgb2xyz(R, G, B);
		return self.xyz2lab(xyz.x, xyz.y, xyz.z);
	}

	self.rgbToHex = function(r, g, b) {
	    if (r > 255 || g > 255 || b > 255)
	        throw "Invalid color component";
	    return ((r << 16) | (g << 8) | b).toString(16);
	}

    

	self.rgb2xyz=function(R,G,B){
		 //R from 0 to 255
		 //G from 0 to 255
		 //B from 0 to 255
		 var r = R/255;
		 var g = G/255;
		 var b = B/255;

		if (r > 0.04045){ r = Math.pow((r + 0.055) / 1.055, 2.4); }
		else { r = r / 12.92; }
		if ( g > 0.04045){ g = Math.pow((g + 0.055) / 1.055, 2.4); }
		else { g = g / 12.92; }
		if (b > 0.04045){ b = Math.pow((b + 0.055) / 1.055, 2.4); }
		else {	b = b / 12.92; }

		r = r * 100;
		g = g * 100;
		b = b * 100;

		//Observer. = 2°, Illuminant = D65
		var xyz = {x:0, y:0, z:0};
		xyz.x = r * 0.4124 + g * 0.3576 + b * 0.1805;
		xyz.y = r * 0.2126 + g * 0.7152 + b * 0.0722;
		xyz.z = r * 0.0193 + g * 0.1192 + b * 0.9505;

		return xyz;

	}
	
	self.xyz2lab =function(X, Y, Z ){
		const REF_X = 95.047; // Observer= 2°, Illuminant= D65
		const REF_Y = 100.000; 
		const REF_Z = 108.883; 

		var x = X / REF_X;   
		var y = Y / REF_Y;  
		var z = Z / REF_Z;  

		if ( x > 0.008856 ) { x = Math.pow( x , 1/3 ); }
		else { x = ( 7.787 * x ) + ( 16/116 ); }
		if ( y > 0.008856 ) { y = Math.pow( y , 1/3 ); }
		else { y = ( 7.787 * y ) + ( 16/116 ); }
		if ( z > 0.008856 ) { z = Math.pow( z , 1/3 ); }
		else { z = ( 7.787 * z ) + ( 16/116 ); }

		var lab = {l:0, a:0, b:0};
		lab.l = ( 116 * y ) - 16;
		lab.a = 500 * ( x - y );
		lab.b = 200 * ( y - z );

		return lab;
	}
	
	
	
	self.getUrlVars = function() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        var i;
        for (i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    };

   
};