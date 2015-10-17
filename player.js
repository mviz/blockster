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
    if (event.keyCode == SPACE_BAR) {
    	if (playing) {
        	event.preventDefault();
        	jump();
    	} else {
    		play_again();
    	}
   	}
}

function is_dead(player) {
	return player.y > canvas.height + 20;
}

function jump(event) {
	if(event !== undefined) {
		event.preventDefault();
	}

	if(world.player.hasJump){
    	world.player.vy = -1;
    } else if (world.player.hasBoost){
    	world.player.vy = -0.7;
    	world.player.hasBoost = false;
    }
}