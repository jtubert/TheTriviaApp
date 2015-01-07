/**
 * This is a namespace.
 *
 * @namespace com.jtubert
 */
var com = {jtubert:{}};

/**
 * Some function.
 *
 * @class com.jtubert.SpaceShip
 * @return {SpaceShip} Self.
 */
com.jtubert.SpaceShip = function() {

	var self = this;
	

	
	/**
	 * This is the init method of the SpaceShip
	 *
	 * @method init
	 * @return {void} Doesn't return anything.
	 */
    self.init = function() {
		var b = $("#box");
		var x;
		var y;
		var speed = 5;

	
		$("body").keydown(function(event) {
			console.log("xxx");
			x = Number(b.css("left").replace("px",""));
			y = Number(b.css("top").replace("px",""));
			
			
			switch (event.keyCode) {
				
				case 37:
					x-=speed;
					//console.log("left: "+b.css("left"));
		     		break;
				case 38:
					y-=speed;
					//console.log("top");
			     	break;
				case 39:
					x+=speed;
					//console.log("right");
			     	break;
				case 40:
					y+=speed;
					//console.log("bottom");
			     	break;
				default:
					//console.log(event.keyCode);
					break;
			}
			
			b.css("left",x+"px");
			b.css("top",y+"px");
			event.preventDefault(); 
		});
    };	
	
    

	
	
	return this;
};
