//dotcloud push spaceship

/**
 * This is a namespace.
 *
 * @namespace com.jtubert
 */
var com = {jtubert:{}};

/**
 * Some function.
 *
 * @class com.jtubert.Main
 * @return {Main} Self.
 */
com.jtubert.Main = function() {

	var self = this;
	
	var aRotation=[]; 
	var aShipAnimation=[];
	var shipAnimationArrayLength;
	var ship;
	var shipHolder;
	var animationTimer;	
	var playerObject;
	var canvasBD;
	var canvasBitmap;
	var backgroundBD;
	var backgroundSource;
	var gameTimer;
	var backgroundRect;
	var backgroundPoint;
	var playerRect;
	var playerPoint;
	var aKeyPress=[];
	var spriteHeight=0;
	var spriteWidth=0;

	//** part 2 variables
	var aAsteroidAnimation=[];
	var asteroidAnimationTimer;
	var asteroidHolder;
	var asteroidFrames=12;
	var aRock=[];
	var level=1;
	var rockPoint=new com.jtubert.Point(0,0);
	var rockRect=new com.jtubert.Rectangle(0,0,36,36);
	var levelRocksCreated=false;
	
	
	//*** part 3 variables
	var missleTileSheet;
	var aMissileAnimation;
	var aMissile; //holds missile objects fires
	var missileSpeed=4;
	var missileWidth=4;
	var missileHeight=4;
	var missileArrayLength=10;
	var missilePoint=new com.jtubert.Point(0,0);
	var missileRect=new com.jtubert.Rectangle(0,0,4,4);
	var missileMaxLife=50;
	var missileFireDelay=100;
	var lastMissileShot;
	
	var rot = 0;
	var rotSpeed = 5;
	var propultion;	
	var spaceship;
	
	/**
	 * This is the init method of the Main
	 *
	 * @method init
	 * @return {void} Doesn't return anything.
	 */
    self.init = function() {	
		self.Main();		
		return this;
	};

	self.Main = function() {		
		self.createObjects();
		self.createRotationArray();
		self.createShipAnimation();		
		self.startGame();
	}
	
	self.createObjects = function() {
		lastMissileShot=new Date().getTime();
		
		
		//create generic object for the player
		playerObject={};
		playerObject.arrayIndex=0;
		playerObject.x=200;
		playerObject.y=200;
		playerObject.dx=0;
		playerObject.dy=0;
		playerObject.movex=0;
		playerObject.movey=0;
		playerObject.acceleration=.3;
		playerObject.maxVelocity=8;
		playerObject.friction=.01;
		playerObject.centerx=playerObject.x;
		playerObject.centery=playerObject.y;
		playerRect=new com.jtubert.Rectangle(0,0,spriteWidth*2,spriteHeight*2);
		playerPoint=new com.jtubert.Point(playerObject.x,playerObject.y);		
		
		aMissile=[];
		aMissileAnimation=[];
		//missleTileSheet=new missile_sheet(40,4);
		var tilesPerRow=10;
		var tileSize=4;
		for (var tileNum=0;tileNum<10;tileNum++) {
			var sourceX=(tileNum % tilesPerRow)*tileSize;
			var sourceY=(Number(tileNum/tilesPerRow))*tileSize;
			//var tileBitmapData=new BitmapData(tileSize,tileSize,true,0x00000000);
			//tileBitmapData.copyPixels(missleTileSheet,new com.jtubert.Rectangle(sourceX,sourceY,tileSize,tileSize),new com.jtubert.Point(0,0));
			//aMissileAnimation.push(tileBitmapData);
		}
		
	}
	
	self.createRotationArray = function() {
		shipAnimationArrayLength=36;
		var rotation=0;
		for (var ctr=0;ctr<shipAnimationArrayLength;ctr++) {
			var tempObject={};
			tempObject.dx=Math.cos(2.0*Math.PI*(rotation-90)/360.0);
			tempObject.dy=Math.sin(2.0*Math.PI*(rotation-90)/360.0);			
			aRotation.push(tempObject);
			rotation+=10;
		}	
	}
	
	self.createShipAnimation = function() {
		shipHolder=$("#shipHolder");
		shipHolder.css("left","109px");
		shipHolder.css("top","226px");
		ship=$("#ship");
		propultion = $("#propultion");
		propultion.hide();
		
		spaceship = $("#spaceship");			
	}
	
	self.startGame = function() {	
		$(document).keydown(function(event) {			
			aKeyPress[event.keyCode]=true;
		});		
		$(document).keyup(function(event) {			
			aKeyPress[event.keyCode]=false;
		});		
		gameTimer = setInterval(function(){self.runGame();},50);						
	}
	
	self.runGame = function(eEvent) {
		self.checkKeys();
		self.updatePlayer();
		self.updateMissiles();		
		self.drawPlayer();	
		self.drawMissiles();
		self.updateDebugger();
	}
	
	self.updateDebugger = function(){
		var str = playerObject.x + "<br>";
		str += playerObject.y + "<br>";
		str += rot + "<br>";
		str += $("#missile").css("left") + "<br>";
		str += $("#missile").css("top") + "<br>";
		
		
		$("#debugger").html(str);
	}
			
	self.checkKeys = function() {		
		if (aKeyPress[38]){			
			propultion.show();		
			
			playerObject.dx=aRotation[playerObject.arrayIndex].dx;
			playerObject.dy=aRotation[playerObject.arrayIndex].dy;
			
			var mxn=playerObject.movex+playerObject.acceleration*(playerObject.dx);
			var myn=playerObject.movey+playerObject.acceleration*(playerObject.dy);
		
			var currentSpeed = Math.sqrt ((mxn*mxn) + (myn*myn));
			if (currentSpeed < playerObject.maxVelocity) {
				playerObject.movex=mxn;
				playerObject.movey=myn;
			}			
		}else{
			propultion.hide();
		}
		
		if (aKeyPress[37]){
			rot-=rotSpeed;
			if (rot <0) rot=360;
			
			playerObject.arrayIndex--;
			if (playerObject.arrayIndex <0) playerObject.arrayIndex=shipAnimationArrayLength-1;
			
		}
		if (aKeyPress[39]){
			rot+=rotSpeed;
			if (rot == 360) rot=0;
						
			playerObject.arrayIndex++;
			if (playerObject.arrayIndex ==shipAnimationArrayLength) playerObject.arrayIndex=0;
			
		}
		//Spacebar
		if (aKeyPress[32]){
			self.fireMissile();
		}
	}
	
	self.updatePlayer = function() {
		
		//add friction
		
		if (playerObject.movex > 0) {
			playerObject.movex-=playerObject.friction;
		}else if (playerObject.movex < 0) {
			playerObject.movex+=playerObject.friction;
		}
		
		if (playerObject.movey > 0) {
			playerObject.movey-=playerObject.friction;
		}else if (playerObject.movey < 0) {
			playerObject.movey+=playerObject.friction;
		}
	
		playerObject.x+=(playerObject.movex);
		playerObject.y+=(playerObject.movey);
					
		playerObject.centerx=playerObject.x+spriteWidth;
		playerObject.centery=playerObject.y+spriteHeight;
		
		if (playerObject.centerx > window.innerWidth) {
			playerObject.x=-spriteWidth;
			playerObject.centerx=playerObject.x+spriteWidth;
		}else if (playerObject.centerx < 0) {
			playerObject.x=window.innerWidth - spriteWidth;
			playerObject.centerx=playerObject.x+spriteWidth;
		}
		
		if (playerObject.centery > window.innerHeight) {
			playerObject.y=-spriteHeight;
			playerObject.centery=playerObject.y+spriteHeight;
		}else if (playerObject.centery < 0) {
			playerObject.y=window.innerHeight-spriteHeight;
			playerObject.centery=playerObject.y+spriteHeight;
		}
		
		//console.log("centerx=" + playerObject.centerx);
	}
	
	self.drawPlayer = function() {
		playerPoint.x=playerObject.x;
		playerPoint.y=playerObject.y;
		
		shipHolder.css("top",Math.round(playerPoint.y)+"px");
		shipHolder.css("left",Math.round(playerPoint.x)+"px");
		
		//console.log(playerObject.arrayIndex);
		
		ship.css("-webkit-transform","rotate("+rot+"deg)");
		ship.css("-moz-transform","rotate("+rot+"deg)");
		ship.css("filter","progid:DXImageTransform.Microsoft.BasicImage(rotation=3)");		
		
		
		//canvasBD.copyPixels(aShipAnimation[playerObject.arrayIndex],playerRect, playerPoint);
	}
	
	
	self.fireMissile = function() {		
		if (new Date().getTime() > lastMissileShot + missileFireDelay) {
			
			var tempMissile={};
			
			var dx = Math.cos(2.0*Math.PI*(rot-90)/360.0);
			var dy = Math.sin(2.0*Math.PI*(rot-90)/360.0);
			
			
			tempMissile.x=playerObject.centerx+dx;
			tempMissile.y=playerObject.centery+dy;
			tempMissile.dx=aRotation[playerObject.arrayIndex].dx;
			tempMissile.dy=aRotation[playerObject.arrayIndex].dy;
			tempMissile.speed=missileSpeed;
			tempMissile.life=150;
			tempMissile.lifeCount=0;
			tempMissile.animationIndex=0;
			
			//console.log(tempMissile);
			
			aMissile.push(tempMissile);
			lastMissileShot=new Date().getTime();
		}
	}
	
	self.updateMissiles = function() {
		var missileLen=aMissile.length-1;
		for (var ctr=missileLen;ctr>=0;ctr--) {			
			var tempMissile=aMissile[ctr];
			
			var dx = Math.cos(2.0*Math.PI*(rot-90)/360.0);
			var dy = Math.sin(2.0*Math.PI*(rot-90)/360.0);
			
			tempMissile.x+=dx*tempMissile.speed;
			tempMissile.y+=dy*tempMissile.speed;
			
			
			
			if (tempMissile.x > window.innerWidth) {
				tempMissile.x=0;
			}else if (tempMissile.x < 0) {
				tempMissile.x=window.innerWidth;
			}
			
			if (tempMissile.y > window.innerHeight) {
				tempMissile.y=0;
			}else if (tempMissile.y < 0) {
				tempMissile.y=window.innerHeight
			}
			
			tempMissile.lifeCount++;
			if (tempMissile.lifeCount > tempMissile.life) {
				aMissile.splice(ctr,1);
				tempMissile=null;
			}
			
		}
	}
	
	self.drawMissiles = function() {
		var missileLen=aMissile.length;
		
		//console.log(missileLen);
				
		for(var i=0;i<missileLen;i++) {
			var tempMissile = aMissile[i];			
			//console.log(tempMissile.x);			
			missilePoint.x=tempMissile.x;
			missilePoint.y=tempMissile.y;					
			
			$("#missile").css("top",Math.round(missilePoint.y)+"px");
			$("#missile").css("left",Math.round(missilePoint.x)+"px");
			
			//canvasBD.copyPixels(aMissileAnimation[tempMissile.animationIndex],missileRect, missilePoint);
			
			tempMissile.animationIndex++;
			if (tempMissile.animationIndex > missileArrayLength-1) {
				tempMissile.animationIndex = 0;
			}
			
			
		}
		
	}
}

/**
 * Point class
 *
 * @class com.jtubert.Point
 * @return {Point} Self.
 */
com.jtubert.Point = function(x, y) {
	var self = this;
	self.x = x;
	self.y = y;
	
	/**
	 * subtract
	 *
	 * @method subtract	
	 * @return {Point} returns a new point.
	 */
	self.subtract = function(p) {
		return new com.jtubert.Point(x-p.x,y-p.y);
	}
	
	return self;
}

/**
 * Rectangle class
 *
 * @class com.jtubert.Rectangle
 * @return {Rectangle} Self.
 */
com.jtubert.Rectangle = function(x,y,w,h) {	
	var self = this;
	
	self.x = self.left = x;
	self.y = self.top = y;
	self.width = w;
	self.height = h;
	self.right = x+w;
	self.bottom = y+h;
	
	return self;
}

