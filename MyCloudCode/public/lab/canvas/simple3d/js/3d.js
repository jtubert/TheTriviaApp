var com={jtubert:{}};
var change = 0;
var canvasManager;

var canvasW = 1000;//window.innerWidth;//500
var canvasH = 500;//window.innerHeight;//500
var canvasX = 0;//(window.innerWidth-canvasW)/2;
var canvasY = 0;//(window.innerHeight-canvasH)/2;
var gRadius = 150;
var gItemSize = 30;
var gCenterItemSize = 100;
var gImageLoaded = 0;
var usePhpProxy = false;
var useImages;

com.jtubert.Main = function(_useImg, _usePhpProxy) {
	var self = this;
	var total;
	var layer;
	var itemsArray;
	useImages = _useImg;
	usePhpProxy = _usePhpProxy;
	
	this.init = function(imagesDivID, centerImageURL) {
		if(useImages){
			self.total = $("#"+imagesDivID).find("img").length;
		}else{
			self.total = 10;
		}
		
		self.itemsArray=new Array();
		canvasManager = new com.jtubert.canvasManager();
		
		$("#merge").click(function(){
			canvasManager.mergeAll();
			return false;
		});
		
		
		
		
		self.createMouseController();
		self.createBackg();
		
		self.createItems(imagesDivID);		
		self.attachCenterItem(centerImageURL);
	}
	
	this.stopAnimation = function(){
		layer.removeEventListener('mousemove', onMove,false);
	}
	
	this.checkProgress = function(){
		if(self.total == gImageLoaded){
			for (var i = 0; i<self.total; i++) {
				self.itemsArray[i].startAnimation();
			}
		}
	}
	
	this.attachCenterItem = function(centerImageURL){
		var centerItem = new com.jtubert.CenterItem();
		centerItem.init(centerImageURL);
	}
	
	this.createItems = function(imagesDivID) {	
		if(useImages){
			var len = $("#"+imagesDivID).find("img").length;
			
			$("#"+imagesDivID).find("img").each(function(index,item){
				var item = new com.jtubert.Item3d(self);
				item.init(index,len,$(this).attr("src"),$(this).attr("alt"));
				self.itemsArray.push(item);
			});
		}else{
			for (var i = 0; i<self.total; i++) {
				var item = new com.jtubert.Item3d(self);
				item.init(i,self.total);
				self.itemsArray.push(item);		
			}
		}
	}
	
	this.createBackg = function(){
		canvasManager.create(-10,"backg",canvasW,canvasH);
		canvasManager.draw("backg",canvasX,canvasY,canvasW,canvasH,"rgba(200,200,200,1)");
		
		var layer = document.getElementById("backg");
		var ctx = layer.getContext("2d");
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.textAlign = "center";
		ctx.font = "30pt Arial";
		//ctx.fillText("Circle of Friends", canvasW/2, 130);
		
	}
	
	this.createMouseController = function() {
		canvasManager.create(60000000,"mouseController",canvasW,canvasH);
		canvasManager.draw("mouseController",canvasX,canvasY,canvasW,canvasH,"rgba(200,200,200,0)");
		
		layer = canvasManager.getLayerByID("mouseController");
		//check the mouse position
		layer.addEventListener('mousemove', onMove,false);
		
		function onMove(e){
			var x = e.clientX-layer.offsetLeft;
			//var y = e.clientY-layer.offsetTop;
			change = (x-(canvasW/2))/100;//((x-10)/50)-5;
			
			//$("#console").html(change);  
		}		

		layer.ontouchmove = function(e){
		  if(e.touches.length == 1){ // Only deal with one finger
		    var touch = e.touches[0]; // Get the information for finger #1
		    var node = touch.target; // Find the node the drag started from		    
			change = (touch.pageX-(canvasW/2))/100;		    
		  }
		}
		
		
	}
	return this;
};

com.jtubert.canvasManager = function(){
	var self = this;
	var canvasWrapper;
	var viewport = {height:0, width:0};
	var canvasOffset = {};
	
	this.create = function(zindex,id,width,height){
		canvasWrapper = $("<canvas style='z-index:"+zindex+"' id='"+id+"' width='"+width+"' height='"+height+"'></canvas>").appendTo("#holder");
		
		//G_vmlCanvasManager.initElement(canvasWrapper[0]);
		
		//self.updateCanvasDimensions();
		
		return canvasWrapper;
	}
	
	this.mergeAll = function(){
		var arr = $("canvas").toArray();
		
		function sortfunction(a, b){
			//Compare "a" and "b" in some fashion, and return -1, 0, or 1
			if(parseInt($(a).css("z-index")) < parseInt($(b).css("z-index"))){
				return -1;
			}else if(parseInt($(a).css("z-index")) > parseInt($(b).css("z-index"))){
				return 1;
			}else{
				return 0;
			}
		}

		var arr2 = arr.sort(sortfunction);
		
		var layer = document.getElementById("copy");
		var ctx = layer.getContext("2d");
		
		//join all canvas into one
		for(var i=0;i<arr2.length;i++){
			//console.log(arr2[i]);
			ctx.drawImage(arr2[i],canvasX,canvasY,canvasW,canvasH);
		}
		/*
		//make image and replace canvas with image
		var img = Canvas2Image.saveAsJPEG(layer,true);
		img.id = "canvasimage";
		img.style.border = layer.style.border;
		layer.parentNode.replaceChild(img, layer);
		*/
		
		$("#canvasHolder").append("<a href='"+layer.toDataURL()+"'>Right click to download image</a>");	
		
	}
	
	this.draw = function(id,x,y,width,height,color){
		console.log(id,x,y,width,height,color);
		
		var layer = document.getElementById(id);
		var ctx = layer.getContext("2d");
		
		//ctx.canvas.width  = width;
		//ctx.canvas.height = height;
		
		
		ctx.fillStyle = color;
		ctx.fillRect (x, y, width, height);
		ctx.fill();
		return ctx;
	}
	
	this.getLayerByID = function(id){
		return document.getElementById(id);
	}
	
	
	//function that updates the size of the canvas based on the window size
	this.updateCanvasDimensions = function()
	{
		//only run if height / width has changed
		if(viewport.height == window.innerHeight &&
			viewport.width == window.innerWidth)
		{
				return
		}

		viewport.height = window.innerHeight;
		viewport.width = window.innerWidth;

		//set the new canvas dimensions
		//note that changing the canvas dimensions clears the canvas.
		canvasWrapper.attr("height", viewport.height);
		canvasWrapper.attr("width", viewport.width);

		//save the canvas offset
		canvasOffset.left = canvasWrapper.attr("offsetLeft");
		canvasOffset.top = canvasWrapper.attr("offsetTop");
	}
	
	
	return this;
}


com.jtubert.Item3d = function(m) {
	var self = this;
	var dtr;
	var total;
	var index;
	
	var ctx;
	var a = 0;
	
	var r;
	var g;
	var b;
	var layer;
	var imgSrc;
	var txt;
	
	var img;
	var main = m;
	
	
	
	this.init = function(index, total,imgSrc,txt) {
		self.imgSrc = imgSrc;
		self.txt = txt;
		self.total = total;
		self.index = index;
		
		canvasManager.create((self.index+1),'item'+(self.index+1),canvasW,canvasH);
		self.ctx = canvasManager.draw('item'+(self.index+1),0,0,gItemSize,gItemSize,"rgba(255,0,0,0)");
		
		//var canvas = $("<canvas style='z-index:-"+(self.index+1)+"' id='item"+(self.index+1)+"' width='500' height='500'></canvas>").appendTo("#holder");
		self.layer = document.getElementById("item"+(self.index+1));
		//self.ctx = self.layer.getContext("2d");
		
		
		
		self.r = Math.round(Math.random()*100);
		self.g = Math.round(Math.random()*100);
		self.b = Math.round(Math.random()*100);
		
		
		//convert degrees to radians
		dtr = Math.PI/180;	
		
		self.a = self.index*Math.floor(360/self.total);
		
		
		
		
		if(useImages){
			if(usePhpProxy){
				self.img = new Image();
				self.img.onload = function(){
					//self.animateItem(100);
					gImageLoaded++;				
					main.checkProgress();
				}
				self.img.src = "/proxied_image?image_url="+escape(self.imgSrc);
				//self.img.src = self.imgSrc;
			}else{
				$.getImageData({
		            url: self.imgSrc,
		            success: function(image) {
						self.img = image;             
						//self.animateItem(100);
						gImageLoaded++;				
						main.checkProgress();

		            },
		            error: function(xhr, text_status) {
		                alert("Error!");
		            }
		        });	
			}			
		}else{
			setInterval( function() { self.animateItem(); }, 10 );
		}
	}
	
	this.startAnimation = function() {		
		setInterval( function() { self.animateItem(); }, 10 );
	}
	
	
	this.animateItem = function() {	
		self.ctx.clearRect(0,0,canvasW,canvasH);

		//user controlled
		self.a += -change;

		var angle = (self.a*dtr);
		var x = (gRadius*Math.cos(angle));
		var z = (gRadius*Math.sin(angle));
		var pers = (200/(200+z));
		var y = 20;

		//change the z order
		$(self.layer).css("z-index",1000000-(Math.round(z)));

		//make color darker to simulate distance when is in the back
		var ratio = Math.min(((pers*100)-40)/100,1);
		var difference = Math.round(ratio * 255) * -1;
		var r2 = Math.max(Math.abs(self.r+difference),0);
		var g2 = Math.max(Math.abs(self.g+difference),0);
		var b2 = Math.max(Math.abs(self.b+difference),0);
		
		self.ctx.shadowOffsetX = 10;
		self.ctx.shadowOffsetY = 10;
		self.ctx.shadowBlur = 30;
		self.ctx.shadowColor = "gray";

		if(useImages){
			//use translate to center the items on the canvas
			self.ctx.translate((canvasW/2)-((pers*gItemSize)/2), (canvasH/2)-((pers*gItemSize)/2));
			self.ctx.drawImage(self.img, pers*x, pers*y,pers*gItemSize,pers*gItemSize);
			//add text
			self.ctx.fillStyle = 'rgba(100,100,100,1)';
			self.ctx.textAlign = "center";
			self.ctx.font = ratio*8+"pt Arial Bold";
			self.ctx.fillText(self.txt, ((pers*x))+((pers*gItemSize)/2), (pers*y)+(pers*gItemSize)+15);
			//
			self.ctx.translate(-(canvasW/2)+((pers*gItemSize)/2), -(canvasH/2)+((pers*gItemSize)/2));
		}else{
			self.ctx.fillStyle = 'rgba('+r2+','+g2+','+b2+','+1+')';
			//use translate to center the items on the canvas
			self.ctx.translate((canvasW/2)-((pers*gItemSize)/2), (canvasH/2)-((pers*gItemSize)/2));
			self.ctx.fillRect((pers*x),pers*y,pers*gItemSize,pers*gItemSize);
			self.ctx.translate(-(canvasW/2)+((pers*gItemSize)/2), -(canvasH/2)+((pers*gItemSize)/2));
			self.ctx.fill();
		}
		
		
	}
	
	return this;
};

com.jtubert.CenterItem = function() {
	var self = this;
	var dtr;

	var ctx;
	var a = 0;

	var r;
	var g;
	var b;
	var layer;
	var img;

	this.init = function(centerImageURL) {
		canvasManager.create(0,"centerItem",canvasW,canvasH);
		self.ctx = canvasManager.draw("centerItem",0,0,gCenterItemSize,gCenterItemSize,"rgba(255,0,0,0)");

		self.layer = document.getElementById("centerItem");
		//convert degrees to radians
		dtr = Math.PI/180;	
		self.a = 270;
		
		self.ctx.shadowOffsetX = 10;
		self.ctx.shadowOffsetY = 10;
		self.ctx.shadowBlur = 30;
		self.ctx.shadowColor = "gray";
		
		if(useImages){
			if(usePhpProxy){
				self.img = new Image();
				self.img.onload = function(){
					//self.animateItem(100);
					setInterval( function() { self.animateItem(); }, 10 );
				}
				//self.img.src = centerImageURL;
				self.img.src = "/proxied_image?image_url="+escape(centerImageURL);
			}else{
				$.getImageData({
		            url: centerImageURL,
		            success: function(image) {
						self.img = image;             
						setInterval( function() { self.animateItem(); }, 10 );

		            },
		            error: function(xhr, text_status) {
		                alert("Error!");
		            }
		        });	
			}			
		}else{
			setInterval( function() { self.animateItem(); }, 10 );
		}

	}

	this.animateItem = function() {	
		self.ctx.clearRect(0,0,canvasW,canvasH);
		var radius = 0;
		
		var angle = self.a*dtr;
		
		var x = (radius*Math.cos(angle));
		var z = (radius*Math.sin(angle));
		var pers = (200/(200+z));
		var y = 0;

		//change the z order
		$(self.layer).css("z-index",1000000-(Math.round(z)));

		if(useImages){
			self.ctx.translate((canvasW/2)-((pers*gCenterItemSize)/2), (canvasH/2)-((pers*gCenterItemSize)/2));
			self.ctx.drawImage(self.img, pers*x, pers*y,pers*gCenterItemSize,pers*gCenterItemSize);
			self.ctx.translate(-(canvasW/2)+((pers*gCenterItemSize)/2), -(canvasH/2)+((pers*gCenterItemSize)/2));
		}else{
			self.ctx.fillStyle = 'rgba(255,0,0,1)';
			//use translate to center the items on the canvas
			self.ctx.translate((canvasW/2)-((pers*gCenterItemSize)/2), (canvasH/2)-((pers*gCenterItemSize)/2));
			self.ctx.fillRect(pers*x,-pers*y,pers*gCenterItemSize,pers*gCenterItemSize);
			self.ctx.translate(-(canvasW/2)+((pers*gCenterItemSize)/2), -(canvasH/2)+((pers*gCenterItemSize)/2));

			self.ctx.fill();
		}
		
		
		
	}
	
	return this;
};