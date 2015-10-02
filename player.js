var MAX_GRAVITY = 1;
var GRAVITY = +1;


function apply_physics(player) {
	if(player.vy < MAX_GRAVITY){
		player.vy += GRAVITY;
	}
	player.y  += player.vy;
}