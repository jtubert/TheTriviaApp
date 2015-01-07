/**
 * Some function.
 *
 * @class com.jtubert.Portrait
 * @return {Portrait} Self.
 */
com.jtubert.Portrait = function() {
    /*jslint browser: true, debug: true, eqeqeq: false, undef: false */

	var self = this;
	var smallImageSize = 80;
	var mainImageSize = 1500;
	var totalPaletteImages = 20;
	var paletterImagesLoaded = 0;
	var mainImagePixelColorsArr = [];
	var paletteArray = [];
	var currentImageProcessing = 0;
	var limit = null;
	
	var img;
	
	/**
	 * This is the init method of the ScaleBitmap
	 *
	 * @method init
	 * @param {String} No param
	 * @return {void} Doesn't return anything.
	 */
    self.init = function() {		
		if(self.getUrlVars().url){		
			self.img = self.getUrlVars().url;
		}else{
			//default image
			self.img = "GroupLeader_JohnTubert.jpg";
		}
		
		if(self.getUrlVars().limit){
			self.limit = Number(self.getUrlVars().limit);
		}
		
		if(self.getUrlVars().size){
			mainImageSize = Number(self.getUrlVars().size);
		}	
		
		if(self.getUrlVars().mode && self.getUrlVars().mode.indexOf("google") == 0 && self.getUrlVars().q){	
			//http://localhost:8888/git/canvas/portrait/?limit=10&size=200&mode=google&q=superman
			
			$("#images").append("<div id='holder'></div>");
			$("#images").hide();			
			var googleImageSearch = com.jtubert.GoogleImageSearch();
			googleImageSearch.init({q:self.getUrlVars().q,img:self.img,limit:self.limit});			
		}else{
			//http://localhost:8888/git/canvas/portrait/?limit=10&size=200&mode=instagram
			
			var instagram = new com.jtubert.instagram();
			instagram.init({type:"userInfo",limit:self.limit});//userSelfFeed userFollows userInfo
		}		
    };	
	
    self.loadImage = function(imgURL, index,callback){
		var url = imgURL;	
        img = new Image();
		img.url = url;

		
        img.onload = function(){				
			this.width=smallImageSize;
			this.height=smallImageSize;

			
			           
			callback(this,index);	                
        };
        //img.crossOrigin = 'anonymous';
        img.src = "/proxied_image?image_url="+url;
    };

	//this gets called from Instagram.js once all images are loaded
	
	self.allInstagramImagesLoaded = function(profileImageURL){		
		$("#loading").text("Load profile picture...");
		
		
		if(self.img){
			profileImageURL = self.img;
		}
		
		self.loadImage(profileImageURL,-1,self.getImageData);


		
		$("#canvasImages").hide();
		$("#colors").hide();
	}
	
	self.getColorFromPaletteImage = function(img,index){
		//paletterImagesLoaded++;
		
		
		
		//console.log("getMainColorFromImage",img,index);
		
		var layer = self.makeCanvasFromImage(img, index, smallImageSize, 0);
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
		
		var cmap = MMCQ.quantize(pixelArray, 2);		
	    var palette = cmap.palette();
	
		
	
		//for(var i=0;i<palette.length;i++){		
		var r = palette[0][0];
		var g = palette[0][1];
		var b = palette[0][2];		
		var hex = "#" + ("000000" + self.rgbToHex(r, g, b)).slice(-6);
		
		paletteArray.push({hex:hex,index:index,img:img,rgbColor:{r:r,g:g,b:b}});
		
		//self.drawColorbox(hex);
		
		
		if(paletterImagesLoaded >= totalPaletteImages){
			console.log("finish loading images",paletteArray.length);
			self.matchPicsToColors();
			$("#canvasImages").html("");
			$("#colors").html("");
			
					
		}else{
			setTimeout(self.doWork, 1);
		}
		
		
		
				
	}
	
	
	
	self.matchPicsToColors = function(){
		var arr = [];
		
		for(var i = 0; i< mainImagePixelColorsArr.length;i++){
			$("#loading").text("finding closest color..."+i+"/"+mainImagePixelColorsArr.length);
			
			var rgbColor = mainImagePixelColorsArr[i].rgbColor;
			
			var closestColor = self.getClosestColor(paletteArray,mainImagePixelColorsArr[i].rgbColor);
			
			arr.push(closestColor);
			//paletteArray
		}
		
		/*
		
		//test how many images you are actually using
		
		var testArr = [];		
		for(var i = 0; i< arr.length;i++){
			var el = arr[i];			
			testArr.pushUnique(el);			
		}		
		console.log(testArr.length);   //258 out 673
		*/
		
		
		self.drawPictureGrid(arr);
		
		//self.debugView(arr);	
	}
	
	self.debugView = function(arr){
		console.log(arr);
		
		var totalPieces = (smallImageSize*smallImageSize);
		var tableStr = '<table border="1">';		
		
		for (i = 0; i < totalPieces; i++) {
			tableStr += "<tr>";
			tableStr += "<td><img width='50px' height='50px'src='"+$(arr[i].img).attr('src')+"'/></td>";
			tableStr += '<td><div style="z-index:4;width:50px; height:50px;position:relative;background-color:'+mainImagePixelColorsArr[i].hex+'">&nbsp;</div></td>';
			tableStr += '<td><div style="z-index:4;width:50px; height:50px;position:relative;background-color:'+arr[i].hex+'">&nbsp;</div></td>';			
			tableStr += "<td>"+i+"</td>";
			tableStr += "</tr>";
			
			
		}
		
		tableStr += "</table>";
		
		$("body").append(tableStr);
	}
	
	/*
	Array.prototype.pushUnique = function (item){
	    if(this.indexOf(item) == -1) {
	    //if(jQuery.inArray(item, this) == -1) {
	        this.push(item);
	        return true;
	    }
	    return false;
	}
	*/
	
	self.drawPictureGrid = function(arr){
		var canvas = document.getElementById('mainImage');
        var ctx = canvas.getContext('2d');
		
		var totalPieces = (smallImageSize*smallImageSize);
		var space = 0;
		var gridW = mainImageSize;
		var column = Math.ceil(Math.sqrt(totalPieces));
        var scale = Math.floor((gridW - (space * (column - 1))) / column);
        var x = 0;
        var y = 0;        
        var startX = 0; 
        
        var i;

        for (i = 0; i < totalPieces; i++) {
            //set x and y position
            if (i <= column - 1) {
                x = startX + (((scale + space) * i));
                y = 0;
                //$("#secondsLeft h1").append(i+": "+x+" ,"+y+" // ");
            } else {
                x = startX + (((scale + space) * (i - (Math.floor(i / column)) * column)));
                y = (((scale + space) * (Math.floor(i / column))));
            }

			ctx.drawImage(arr[i].img,x,y,scale,scale);
			
			/*
			//draw the colors
			ctx.fillStyle = arr[i].hex;
			ctx.fillRect (x, y, scale, scale);
			ctx.fill();
			*/
		}
		
		// save canvas image as data url (png format by default)
		//var dataURL = canvas.toDataURL();
		//document.getElementById('canvasImg').src = dataURL;
		//$("#mainImage").html("");
	}
	
	self.drawColorbox = function(hexcolor){
		var ele = $("<div style='border-color:white;border-style:solid;border-width:0px;width:50px; height:50px;background-color:"+hexcolor+"'></div>").appendTo("#colors");
	}
	
	self.getClosestColor = function(palette,color){
		
		//$("#loading").text("Load profile picture...");
		var labColor1 = self.rgb2lab(color.r,color.g,color.b);
		var dis = null;
		var closestColor;
		
		
		//console.log("getClosestColor: ",palette.length);
		
		for(var i=0;i<palette.length;i++){
			var rgbColor = palette[i].rgbColor;
			
			var r = rgbColor.r;
			var g = rgbColor.g;
			var b = rgbColor.b;
			
			var labColor2 = self.rgb2lab(r,g,b);
			var d = self.deltaE(labColor1,labColor2);
			
			//console.log(d);
			
			if(dis == null || dis > d){
				dis = d;
				
				closestColor = palette[i];
			}
		}
		//console.log("closestColor: ",closestColor);
		
		
		
		return closestColor;
		
	}

	self.getImageData = function(imageObj){
		$("#loading").text("Getting profile picture color information...");
		
		var canvas = document.getElementById('mainImage');
        var context = canvas.getContext('2d');
        var x = 0;
        var y = 0;	

        context.drawImage(imageObj, x, y,imageObj.width, imageObj.height);
		

        var imageData = context.getImageData(x, y, imageObj.width, imageObj.height);
        var data = imageData.data;
		
		

        for(var i = 0; i < data.length; i += 4) {
			var red = data[i];         
			var green = data[i + 1];          
			var blue = data[i + 2];
			
			var hex = self.rgbToHex(red, green, blue);
			
			mainImagePixelColorsArr.push({hex:hex,rgbColor:{r:red,g:green,b:blue}});
			//console.log(hex);
        }        
        self.drawGrid();
	}
	
	self.drawGrid = function(){
		/*
		var canvas = document.getElementById('mainImage');
        var ctx = canvas.getContext('2d');

		canvas.width = mainImageSize;
		canvas.height = mainImageSize;
		
		var totalPieces = (smallImageSize*smallImageSize);
		var space = 0;
		var gridW = mainImageSize;
		var column = Math.ceil(Math.sqrt(totalPieces));
        var scale = Math.floor((gridW - (space * (column - 1))) / column);
        var x = 0;
        var y = 0;        
        var startX = 0; 
        
        var i;

        for (i = 0; i < totalPieces; i++) {
            //set x and y position
            if (i <= column - 1) {
                x = startX + (((scale + space) * i));
                y = 0;
                //$("#secondsLeft h1").append(i+": "+x+" ,"+y+" // ");
            } else {
                x = startX + (((scale + space) * (i - (Math.floor(i / column)) * column)));
                y = (((scale + space) * (Math.floor(i / column))));
            }

			ctx.fillStyle = mainImagePixelColorsArr[i].hex;
			ctx.fillRect (x, y, scale, scale);
			ctx.fill();

		}
		
		//var instagram = com.jtubert.instagram();
		//instagram.init({type:"userInfo"});//userSelfFeed userFollows userInfo
		
		
		
			
		images.each(function( index ) {			
			self.loadImage($(this).attr("src"),index,self.getColorFromPaletteImage);			
		});
		*/
		var images = $("#holder").find("img");
		
		totalPaletteImages = images.length;
		
		setTimeout(self.doWork, 1);
		
	}
	
	self.drawGridInSteps = function(step){
		var canvas = document.getElementById('mainImage');
        var ctx = canvas.getContext('2d');
		
		//
		ctx.clearRect(0,0,mainImageSize,mainImageSize);

		canvas.width = mainImageSize;
		canvas.height = mainImageSize;
		
		var totalPieces = (smallImageSize*smallImageSize);
		var space = 0;
		var gridW = mainImageSize;
		var column = Math.ceil(Math.sqrt(totalPieces));
        var scale = Math.floor((gridW - (space * (column - 1))) / column);
        var x = 0;
        var y = 0;        
        var startX = 0; 
        
        var i;

        for (i = 0; i < step; i++) {
            //set x and y position
            if (i <= column - 1) {
                x = startX + (((scale + space) * i));
                y = 0;
                //$("#secondsLeft h1").append(i+": "+x+" ,"+y+" // ");
            } else {
                x = startX + (((scale + space) * (i - (Math.floor(i / column)) * column)));
                y = (((scale + space) * (Math.floor(i / column))));
            }

			ctx.fillStyle = mainImagePixelColorsArr[i].hex;
			ctx.fillRect (x, y, scale, scale);
			ctx.fill();

		}		
	}
	
	self.doWork = function() {		
		paletterImagesLoaded++;

		$("#loading").text("Extracting main color form image..."+paletterImagesLoaded+"/"+totalPaletteImages);
		console.log(paletterImagesLoaded+"/"+totalPaletteImages);
	
		
		var totalPieces = (smallImageSize*smallImageSize);
		var x = (paletterImagesLoaded * totalPieces)/totalPaletteImages;
		
		self.drawGridInSteps(x);
		
		var images = $("#holder").find("img");
	
		self.loadImage($(images[paletterImagesLoaded-1]).attr("src"),paletterImagesLoaded-1,self.getColorFromPaletteImage);		
	};	
	
	/**********************************/
	/* UTILITIES FUNCTIONS START HERE */
	/**********************************/
	/**********************************/
	/**********************************/
	/**********************************/
	/**********************************/
	self.makeCanvasFromImage = function(img,index,w,x){
		//get the image width and height
		var imageW = img.width;
		var h = img.height;
		
		
		var canvasWrapper = $("<canvas style='z-index:"+index+"' id='img"+index+"' width='" + imageW + "'height='" + h + "'></canvas>").appendTo("#canvasImages");
		var layer = document.getElementById("img"+index);
        var ctx = layer.getContext("2d");
		ctx.drawImage(img, 0, 0,w,h);	
		
		
		
		return layer;
	}
	
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
	
	
	return this;
};