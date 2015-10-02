var MAX_GRAVITY = 2;
var GRAVITY = +0.01;


function apply_physics(player, frame) {
	if (frame % 3 == 0){
		player.vy += GRAVITY
	}
	// if(player.vy <= MAX_GRAVITY){
	// 	player.vy += GRAVITY;
	// }
	player.y  += Math.floor(player.vy);
}