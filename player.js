var GRAVITY = +0.01;
var MAX_VEL = 3;

function apply_physics(player) {
	if(player.vy < 1){
		player.vy += GRAVITY;
	}
	player.y += player.vy
}

function keyDownHandler(e) {
    if (e.keyCode == 32) {
        e.preventDefault();
        player.isJumping = true
        if(player.isGrounded){
        	player.vy = -1;
        }
    }
}

function is_dead(player) {

	if(player.y > canvas.height + 20) {
		player.vy = 0;
		return true;
	}

	return false;
}