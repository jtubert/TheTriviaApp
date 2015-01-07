/**
 * This is a namespace.
 *
 * @namespace com.jtubert
 */
var com = {jtubert:{Puzzle:{}}};

/**
 * Some function.
 *
 * @class com.jtubert.ScaleBitmap
 * @return {ScaleBitmap} Self.
 */
com.jtubert.ScaleBitmap = function() {
    /*jslint browser: true, debug: true, eqeqeq: false, undef: false */

	var self = this;
	var obj;
	
	/**
	 * This is the init method of the ScaleBitmap
	 *
	 * @method init
	 * @param {String} imgID Img id
	 * @return {void} Doesn't return anything.
	 */
    self.init = function(obj) {
		self.obj = obj;
		
		if(self.getUrlVars().width){
			self.obj.targetWidth = self.getUrlVars().width;
		}
		
		if(self.getUrlVars().height){
			self.obj.targetHeight = self.getUrlVars().height;
		}
			
		self.loadImage(obj.id);
    };	
	
    self.loadImage = function(imgID){
		var url = $("#"+imgID).attr("src");	
	
        if(url.indexOf("http://") > -1){
            $.getImageData({
                url: url,
                success: function(image) {
                    img = image;
                    self.scaleIt(imgID,image);

                },
                error: function(xhr, text_status) {
                    alert("Error!");
                }
            });
        }else{
            img = new Image();
            img.onload = function(){               
                self.scaleIt(imgID,img);                
            };

            img.src = url;
        }    
    };

	self.getCanvasCropped = function(imgID,img,index,w,h,x,y){
		
		//console.log(index,": ",w,h,x,y);
		
		//get the image width and height
		var imageW = $("#"+imgID).css("width");
		var imageH = $("#"+imgID).css("height");
		
		//crop the image in 9 pieces for scale 9.
		var canvasWrapper = $("<canvas style='z-index:"+index+"' id='img"+index+"' width='" + w + "px' height='" + h + "px'></canvas>").appendTo("center");
		var layer = document.getElementById("img"+index);
        var ctx = layer.getContext("2d");
		//ctx.drawImage(img, 0, 0,w.replace("px",""),h.replace("px",""));	
		
		
		//draw cropped image
        var sourceX = x;
        var sourceY = y;
        var sourceWidth = w;//Number(imageW.replace("px",""));
        var sourceHeight = h;//Number(imageH.replace("px",""));
        var destX = 0;
        var destY = 0;
        var destWidth = w;//Number(w.replace("px",""))/2;
        var destHeight = h;//Number(h.replace("px",""));
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
		
		return layer;
	}

	self.scaleIt = function(imgID,img){
		var w = $("#"+imgID).css("width").replace("px","");
		var h = $("#"+imgID).css("height").replace("px","");
		var index = 0;
		
		var centerW = self.obj.targetWidth-(self.obj.left+self.obj.right);
		var centerH = self.obj.targetHeight-(self.obj.top+self.obj.bottom);
		var sourceWidth = w - (self.obj.left+self.obj.right);
		var layerRightXpos = self.obj.left + centerW;
		var sourceHeight = h-(self.obj.top+self.obj.bottom);
		var ypos = h - (self.obj.bottom);
		///////////////////////////////////
		var topLeft = self.getCanvasCropped(imgID,img, index++, self.obj.left, self.obj.top,0,0);
		var topCenter = self.getCanvasCropped(imgID,img, index++, sourceWidth, self.obj.top,self.obj.left,0);
		$("#img1").css("width",centerW+"px");
		$("#img1").css("height",self.obj.top+"px");
		var topRight = self.getCanvasCropped(imgID,img, index++, self.obj.right, self.obj.top,w-self.obj.right,0);
		///////////////////////////////////
		var middleLeft = self.getCanvasCropped(imgID,img, index++, self.obj.left, sourceHeight,0,self.obj.top);
		$("#img3").css("width",self.obj.left+"px");
		$("#img3").css("height",centerH+"px");
		var middleCenter = self.getCanvasCropped(imgID,img, index++, sourceWidth, sourceHeight,self.obj.left,self.obj.top);
		$("#img4").css("width",centerW+"px");
		$("#img4").css("height",centerH+"px");
		var middleRight = self.getCanvasCropped(imgID,img, index++, self.obj.right, sourceHeight,w-self.obj.right,self.obj.top);
		$("#img5").css("width",self.obj.right+"px");
		$("#img5").css("height",centerH+"px");
		///////////////////////////////////
		var bottomLeft = self.getCanvasCropped(imgID,img, index++, self.obj.left, self.obj.bottom,0,ypos);
		$("#img6").css("width",self.obj.left+"px");
		$("#img6").css("height",self.obj.bottom+"px");
		var bottomCenter = self.getCanvasCropped(imgID,img, index++, sourceWidth, self.obj.bottom,self.obj.left,ypos);
		$("#img7").css("width",centerW+"px");
		$("#img7").css("height",self.obj.bottom+"px");
		var bottomRight = self.getCanvasCropped(imgID,img, index++, self.obj.right, self.obj.bottom,w-self.obj.right,ypos);
		$("#img8").css("width",self.obj.right+"px");
		$("#img8").css("height",self.obj.bottom+"px");
		///////////////////////////////////
		
		
		
		/*
		var layerLeft = self.getCanvasCropped(imgID,img, 1, self.obj.left, 0);
		var centerW = self.obj.targetWidth-(self.obj.left+self.obj.right);
		var sourceWidth = w - (self.obj.left+self.obj.right);
		//imgID,img,index,w,x
		var layerCenter = self.getCanvasCropped(imgID,img, 2, sourceWidth, self.obj.left);
		$("#img2").css("width",centerW+"px");
		$("#img2").css("height",h+"px");
		var layerRightXpos = self.obj.left + centerW;
		var layerRight = self.getCanvasCropped(imgID,img, 3, self.obj.right, w-self.obj.right);
		*/
		
		
		
		
		
		
		
		
		var combinedCanvas = $("<canvas id='cc' width='"+self.obj.targetWidth+"px' height='"+self.obj.targetHeight+"px'></canvas>").appendTo("center");
		$("#cc").css("width",self.obj.targetWidth+"px");
		$("#cc").css("height",self.obj.targetHeight+"px");
		
		var can = document.getElementById('cc');
		var ctx = can.getContext('2d');
		
		//sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight
		ctx.drawImage(topLeft, 0, 0);
		ctx.drawImage(topCenter, 0, 0, sourceWidth, self.obj.top, self.obj.left, 0, centerW, self.obj.top);
		ctx.drawImage(topRight, centerW+self.obj.left, 0);
		
		ctx.drawImage(middleLeft, 0, 0,self.obj.left,sourceHeight,0,self.obj.top,self.obj.left,centerH);
		ctx.drawImage(middleCenter, 0, 0, sourceWidth, sourceHeight, self.obj.left, self.obj.top, centerW, centerH);
		ctx.drawImage(middleRight, 0,0,self.obj.right,sourceHeight,centerW+self.obj.right,self.obj.top,self.obj.right,centerH);
		
		ctx.drawImage(bottomLeft, 0, centerH+self.obj.top);
		ctx.drawImage(bottomCenter, 0, 0, sourceWidth, self.obj.bottom, self.obj.left, centerH+self.obj.bottom, centerW, self.obj.bottom);
		ctx.drawImage(bottomRight, centerW+self.obj.right, centerH+self.obj.bottom);
		
		
		
		/*
		ctx.drawImage(layerLeft, 0, 0);
		ctx.drawImage(layerCenter, 0, 0, sourceWidth, h, self.obj.left, 0, centerW, h);
		ctx.drawImage(layerRight, centerW+self.obj.left, 0);
		*/
		//clone the img element but use the canvas src
		$("#"+imgID).clone().attr("id",imgID+"_clone").attr("src",can.toDataURL()).appendTo("center");
		$("#"+imgID+"_clone").css("width",self.obj.targetWidth+"px");
		$("#"+imgID+"_clone").css("height",self.obj.targetHeight+"px");
		
		//console.log(self.obj.targetWidth,centerW);
		
		
		//remove original image
		$("#img0").remove();
		$("#img1").remove();
		$("#img2").remove();
		$("#img3").remove();
		$("#img4").remove();
		$("#img5").remove();
		$("#img6").remove();
		$("#img7").remove();
		$("#img8").remove();
		
		//remove canvas
		$("#bmp").remove();
		
		$("#cc").remove();
		
		//restore id name
		$("#"+imgID+"_clone").attr("id",imgID);	
		
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
	
	
	return this;
};