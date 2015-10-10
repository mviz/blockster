var GRAVITY = +0.01;
var MAX_VEL = 3;

function apply_physics(player) {
	if(player.vy < 1){
		player.vy += GRAVITY;
	}
	player.y += player.vy
}

//TODO: refactor this. Player context should be only in the player.
function key_down_handler(event) {
    if (event.keyCode == SPACE_BAR && playing) {
        event.preventDefault();
        
        if(player.hasJump){
        	player.vy = -1;
        } else if (player.hasBoost){
        	player.vy = -0.7;
        	player.hasBoost = false;
        }
    }
}

function is_dead(player) {
	return player.y > canvas.height + 20;
}