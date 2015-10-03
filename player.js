var MAX_GRAVITY = 2;
var GRAVITY = +0.01;


function apply_physics(player, frame) {
	if (frame % 5 == 0){
		player.vy += GRAVITY
	}
	// if(player.vy <= MAX_GRAVITY){
	// 	player.vy += GRAVITY;
	// }
	player.y  += Math.floor(player.vy);
}

function keyDownHandler(e) {
	console.log(player.vy)
    if (e.keyCode == 32) {
        e.preventDefault();
        if(player.isGrounded){
        	player.vy = -1;
        }
    }
}