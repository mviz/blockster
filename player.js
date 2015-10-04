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
        if(player.isGrounded){
        	player.vy = -1;
        	player.canDoubleJump = true
        }
        else if (player.canDoubleJump){
        	player.vy = -0.7;
        	player.canDoubleJump = false;
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