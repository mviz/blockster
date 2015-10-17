var MULTIPLIER_TIMEOUT_IN_SECONDS = 4; //in seconds
var GRAVITY = +0.01;
var MAX_VEL = 3;

function apply_physics(player) {
	if(player.vy < 1){
		player.vy += GRAVITY;
	}
	player.y += player.vy
}

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

function get_multiplier_time_left(multiplier, frame) {
	var time_elapsed = frame - multiplier.last_pickup;

	return get_total_time_for_mutliplier(multiplier) - time_elapsed;
}

function get_total_time_for_mutliplier(multiplier) {
	return (2/(0.5 * multiplier.value)) * MULTIPLIER_TIMEOUT_IN_SECONDS * FRAME_RATE;
}



