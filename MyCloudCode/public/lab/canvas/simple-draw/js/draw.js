var com={jtubert:{}};
com.jtubert.draw = function(){
	var self = this;	
	var ctx;
	var lineColor = "#000000";
	var IsiPhoneOS;

	this.init = function(obj){
		var IsiPhone = navigator.userAgent.indexOf("iPhone") !== -1;
        var IsiPod = navigator.userAgent.indexOf("iPod") !== -1;
        var IsiPad = navigator.userAgent.indexOf("iPad") !== -1;
        IsiPhoneOS = IsiPhone || IsiPad || IsiPod;
		
		$("body").append('<canvas id="backg" width="1000" height="1461" style="z-index:0;position:absolute"></canvas>');
		$("body").append("<canvas id='drawLayer' width='1000' height='1461' style='z-index:1;position:absolute'></canvas>");
		$("body").append('<input id="erase" type="button" value="ERASE ALL" style="font-size:40px;z-index:2;position:relative"/>');
		
		$("body").append('<div class="chip" color="#FF0000" style="z-index:4;width:80px; height:80px;position:relative">&nbsp;</div>');
		$("body").append('<div class="chip" color="#00FF00" width="80px" height="80px" style="z-index:5;width:80px; height:80px;position:relative">&nbsp;</div>');
		$("body").append('<div class="chip" color="#0000FF" width="80px" height="80px" style="z-index:6;width:80px; height:80px;position:relative">&nbsp;</div>');
		
		
		ctx = $("#drawLayer")[0].getContext('2d');
		
		$("#erase").bind('click', function(e) {
	      self.eraseAll();
	    });
		
		
		//drawLayer = document.getElementById('drawLayer');		
		//ctx = drawLayer.getContext('2d');
		
		self.drawBackg();
		//drawLayer.addEventListener('mousedown', self.onMouseDown, false);		
		//drawLayer.addEventListener('mouseup', self.onMouseUp, false);
		
		$(document).bind('mousedown', self.onMouseDown);
		$(document).bind('mouseup', self.onMouseUp);
		
		if(IsiPhoneOS){
			document.addEventListener('touchstart', self.onMobileSart, false);
			document.addEventListener('touchend', self.onMobileEnd, false);
			//$(document).bind('touchstart', self.onMobileSart);	
			//$(document).bind('touchend', self.onMobileEnd);
		}
		
		self.createColorChips();
	}
	
	self.onMobileSart = function(e) {
        //alert("onMobileSart: "+e.touches);
		if (e.touches.length === 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            var node = touch.target; // Find the node the drag started from
            
			//alert(node);

            self.onMouseDown(touch);
        }
    };

    self.onMobileEnd = function(e) {
        if (e.changedTouches.length === 1) {
            self.onMouseUp(e.changedTouches[0]);
        }
    };

	self.onMobileMove = function(e) {
        if (e.touches.length === 1) { // Only deal with one finger
            self.onMove(e.changedTouches[0]);
        }
    };
	
	
	this.hex_to_decimal = function(hex) {
		return Math.max(0, Math.min(parseInt(hex, 16), 255));
	};
	this.css3color = function(color, opacity) {
		return 'rgba('+self.hex_to_decimal(color.substr(0,2))+','+self.hex_to_decimal(color.substr(2,2))+','+self.hex_to_decimal(color.substr(4,2))+','+opacity+')';
	};
	
				
	this.drawBackg = function(){
		var backgctx = $("#backg")[0].getContext('2d');
		backgctx.fillStyle = self.css3color("DDDDDD",1);
		backgctx.fillRect(0,0,1000,1461);				
	}			
	this.onMouseDown = function(e){
		//console.log(e);
		//var targ = e.target ? e.target : e.srcElement;
		
		//alert(e.pageX+"/"+e.clientX+"/"+targ+"/"+$(targ).css("top"));
		
		var x = e.clientX;
		var y = e.clientY;		
		
		if(IsiPhoneOS){
			x = e.pageX;
			y = e.pageY;
		}
		
		//alert(x+" / "+y);
		
		ctx.lineWidth = 10;
		ctx.strokeStyle = lineColor;
		ctx.beginPath();
		ctx.moveTo(x,y);
		//drawLayer.addEventListener('mousemove', self.onMove, false);
		
		$(document).bind('mousemove', self.onMove);
		
		document.addEventListener('touchmove', self.onMobileMove, false);
		
		//$(document).bind('touchmove', self.onMobileMove);			
	}

	this.eraseAll = function(){
		ctx.clearRect(0,0,1000,1461);
		//console.log();				
	}			


	this.onMouseUp = function(e){
		$(document).unbind('mousemove');
		//$(document).unbind('touchmove');
		document.removeEventListener('touchmove', self.onMobileMove, false);					
	}			

	this.onMove = function(e) {				
		var x = e.clientX;//-e.offsetX;
		var y = e.clientY;//-e.offsetY;				
		
		
		
		ctx.lineTo(x,y);						
		ctx.stroke();						
	}
	
	
	this.createColorChips = function(){
		
		
		
		$(".chip").each(function(){
		    //console.log("createColorChips: "+$(this).attr("color"));
			$(this).css("background-color",$(this).attr("color"));
			$(this).css("border-style","solid");
			$(this).css("border-width","1px");
			$(this).css("border-color",$(this).attr("color"));				
			$(this).show();
		});			
		$(".chip").click(function(){
			var otherContents = $(this).parent().find(".chip").not($(this));		
			
			$(this).css("border-color","#000000");
			
			otherContents.css("border-color","#DDDDDD");
					
			
			lineColor = $(this).attr("color");
			
		});
	}
	
	
	
	return this;
}