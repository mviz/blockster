var GRAVITY = +0.01;
var MAX_VEL = 3;

function apply_physics(player) {
	if(player.vy < 1){
		player.vy += GRAVITY;
	}
	player.y += player.vy
}

function key_down_handler(e) {
    if (e.keyCode == SPACE_BAR && playing) {
        e.preventDefault();
        if(player.hasJump){
        	player.vy = -1;
        }
        else if (player.hasBoost){
        	player.vy = -0.7;
        	player.hasBoost = false;
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