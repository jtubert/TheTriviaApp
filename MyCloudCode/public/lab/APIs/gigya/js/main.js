/*
var xAngle = 0, yAngle = 0;
        document.addEventListener('keydown', function(e)
        {
                switch(e.keyCode)
                {

                        case 37: // left
                                yAngle -= 1;
                                break;

                        case 38: // up
                                xAngle += 1;
                                break;

                        case 39: // right
                                yAngle += 1;
                                break;

                        case 40: // down
                                xAngle -= 1;
                                break;
                };

				$('#cube').css('-webkit-transform', "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");
				$('#cube').css('-moz-transform', "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");
				$('#cube').css('-ms-transform', "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");
				$('#cube').css('-o-transform', "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");
				$('#cube').css('transform', "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");

        }, false);

*/


var mouseX,mouseY;

function onMobileMove(e) {
	e.preventDefault() ;
	
	
	var x = e.pageX;
    var y = e.pageY;

	onDocumentMouseMove({clientX:x,clientY:y});
};

function onDocumentMouseMove(event){
    mouseX = ( event.pageX - window.innerWidth/2 );
    mouseY = ( event.pageY - window.innerHeight/2 );
	
	//console.log(event);
	
	//$("#logos").css("left",-mouseX);
	
	$('#cube').css('-webkit-transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
	$('#cube').css('-moz-transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
	$('#cube').css('-ms-transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
	$('#cube').css('-o-transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
	$('#cube').css('transform', 'rotate3d('+mouseX+', '+mouseY+', '+0+', '+mouseX+'deg)');
}

$(document).bind('mousemove', onDocumentMouseMove);
$(document).bind('touchmove', onMobileMove);