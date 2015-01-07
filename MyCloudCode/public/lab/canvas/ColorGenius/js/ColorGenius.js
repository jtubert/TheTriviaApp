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
	
	/**
	 * This is the init method of the ScaleBitmap
	 *
	 * @method init
	 * @param {String} imgID Img id
	 * @return {void} Doesn't return anything.
	 */
    self.init = function(imgID) {		
		self.loadImage(imgID);
    };	
	
    self.loadImage = function(imgID){
		var url = $("#"+imgID).attr("src");	
	
        if(url.indexOf("http://") > -1){
            $.getImageData({
                url: url,
                success: function(image) {
                    img = image;
                    self.getColors(imgID,image);

                },
                error: function(xhr, text_status) {
                    alert("Error!");
                }
            });
        }else{
            img = new Image();
            img.onload = function(){               
                self.getColors(imgID,img);                
            };

            img.src = url;
        }    
    };

	self.getCanvasCropped = function(imgID,img,index,w,x){
		//get the image width and height
		var imageW = $("#"+imgID).css("width");
		var h = $("#"+imgID).css("height");
		
		//crop the image in 9 pieces for scale 9.
		var canvasWrapper = $("<canvas style='z-index:"+index+"' id='img"+index+"' width='" + imageW + "'px height='" + h + "'></canvas>").appendTo("center");
		var layer = document.getElementById("img"+index);
        var ctx = layer.getContext("2d");
		//ctx.drawImage(img, 0, 0,w.replace("px",""),h.replace("px",""));	
		
		
		//draw cropped image
        var sourceX = x;
        var sourceY = 0;
        var sourceWidth = Number(imageW.replace("px",""));
        var sourceHeight = Number(h.replace("px",""));
        var destX = 0;
        var destY = 0;
        var destWidth = w;//Number(w.replace("px",""))/2;
        var destHeight = Number(h.replace("px",""));
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
		
		return layer;
	}

	self.getColors = function(imgID,img){
		var w = $("#"+imgID).css("width").replace("px","");
		
		
		var layer = self.getCanvasCropped(imgID,img, 1, w, 0);		
		
		//clone the img element but use the canvas src
		$("#"+imgID).clone().attr("id",imgID+"_clone").attr("src",layer.toDataURL()).appendTo("center");
		
		//remove original image
		$("#"+imgID).remove();
		
		var context = layer.getContext("2d");
		var p = context.getImageData(0, 0, 1, 1).data; 
	    var hex = "#" + ("000000" + self.rgbToHex(p[0], p[1], p[2])).slice(-6);
	    console.log(hex);
		
		//remove canvas
		//$("#img1").remove();
		
		//restore id name
		//$("#"+imgID+"_clone").attr("id",imgID);		
	}
	
	self.findPos = function(obj) {
	    var curleft = 0, curtop = 0;
	    if (obj.offsetParent) {
	        do {
	            curleft += obj.offsetLeft;
	            curtop += obj.offsetTop;
	        } while (obj = obj.offsetParent);
	        return { x: curleft, y: curtop };
	    }
	    return undefined;
	}

	self.rgbToHex = function(r, g, b) {
	    if (r > 255 || g > 255 || b > 255)
	        throw "Invalid color component";
	    return ((r << 16) | (g << 8) | b).toString(16);
	}
	
	return this;
};


com.jtubert.ColorGenius.Utils = new function() {
    var self = this;

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